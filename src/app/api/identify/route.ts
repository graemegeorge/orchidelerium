import { NextRequest, NextResponse } from "next/server";

const MAX_IMAGES = 5;
const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

const RATE_LIMITS = new Map<
  string,
  {
    minute: { count: number; resetAt: number };
    day: { count: number; resetAt: number };
  }
>();

const MINUTE_LIMIT = 5;
const DAY_LIMIT = 30;

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const entry = RATE_LIMITS.get(ip) || {
    minute: { count: 0, resetAt: now + 60_000 },
    day: { count: 0, resetAt: now + 86_400_000 },
  };

  if (now > entry.minute.resetAt) {
    entry.minute = { count: 0, resetAt: now + 60_000 };
  }
  if (now > entry.day.resetAt) {
    entry.day = { count: 0, resetAt: now + 86_400_000 };
  }

  entry.minute.count += 1;
  entry.day.count += 1;

  RATE_LIMITS.set(ip, entry);

  const minuteRemaining = Math.max(0, entry.minute.resetAt - now);
  const dayRemaining = Math.max(0, entry.day.resetAt - now);

  const limited =
    entry.minute.count > MINUTE_LIMIT || entry.day.count > DAY_LIMIT;

  return {
    limited,
    retryAfter: limited
      ? Math.ceil(Math.min(minuteRemaining, dayRemaining) / 1000)
      : 0,
  };
};

type PlantNetImage = {
  url?: string;
  source?: string;
};

type PlantNetSpecies = {
  scientificNameWithoutAuthor?: string;
  scientificName?: string;
  commonNames?: string[];
  genus?: {
    scientificNameWithoutAuthor?: string;
    scientificName?: string;
  };
  family?: {
    scientificNameWithoutAuthor?: string;
    scientificName?: string;
  };
};

type PlantNetResult = {
  score?: number;
  species?: PlantNetSpecies;
  images?: PlantNetImage[];
};

type PlantNetResponse = {
  results?: PlantNetResult[];
  message?: string;
  error?: string;
};

type IdentifyResult = {
  species: string;
  score: number;
  genus: string | null;
  family: string | null;
  images: Array<{ url: string; source?: string | null }>;
  image?: { url: string; source: "inat" };
};

const asResponse = (payload: unknown): PlantNetResponse | null => {
  if (!payload || typeof payload !== "object") return null;
  return payload as PlantNetResponse;
};

const normalizeResults = (payload: unknown): IdentifyResult[] => {
  const response = asResponse(payload);
  const rawResults = Array.isArray(response?.results) ? response.results : [];

  return rawResults.slice(0, 5).map((result: PlantNetResult) => {
    const speciesBlock = result?.species;
    const species =
      speciesBlock?.scientificNameWithoutAuthor ||
      speciesBlock?.scientificName ||
      speciesBlock?.commonNames?.[0] ||
      "Unknown species";

    const images = Array.isArray(result?.images)
      ? result.images
          .filter((image) => typeof image?.url === "string")
          .map((image) => ({
            url: image.url as string,
            source: image?.source || null,
          }))
      : [];

    return {
      species,
      score: typeof result?.score === "number" ? result.score : 0,
      genus:
        speciesBlock?.genus?.scientificNameWithoutAuthor ||
        speciesBlock?.genus?.scientificName ||
        null,
      family:
        speciesBlock?.family?.scientificNameWithoutAuthor ||
        speciesBlock?.family?.scientificName ||
        null,
      images,
    };
  });
};

const fetchInatImage = async (species: string) => {
  const url = new URL("https://api.inaturalist.org/v1/observations");
  url.searchParams.set("taxon_name", species);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("order", "desc");
  url.searchParams.set("order_by", "created_at");
  url.searchParams.set("photos", "true");
  url.searchParams.set("quality_grade", "research,needs_id");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    results?: Array<{
      photos?: Array<{ url?: string | null }>;
    }>;
  };
  const urlCandidate = payload?.results?.[0]?.photos?.[0]?.url;
  if (typeof urlCandidate !== "string") return null;
  return urlCandidate.replace("square", "medium");
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "PLANTNET_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (rate.limited) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": rate.retryAfter.toString(),
        },
      }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 }
    );
  }

  const images = formData.getAll("images");
  const files = images.filter((item) => item instanceof File) as File[];

  if (!files.length) {
    return NextResponse.json(
      { error: "Please provide at least one image." },
      { status: 400 }
    );
  }

  if (files.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: "Please send no more than five images." },
      { status: 400 }
    );
  }

  const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
  if (totalBytes > MAX_BYTES) {
    return NextResponse.json(
      { error: "Total upload size exceeds 50MB." },
      { status: 413 }
    );
  }

  const invalidType = files.find((file) => !ALLOWED_TYPES.has(file.type));
  if (invalidType) {
    return NextResponse.json(
      { error: "Only JPEG or PNG images are supported." },
      { status: 400 }
    );
  }

  const outbound = new FormData();
  files.forEach((file) => {
    outbound.append("images", file, file.name || "image.jpg");
    outbound.append("organs", "auto");
  });

  const url = new URL("https://my-api.plantnet.org/v2/identify/all");
  url.searchParams.set("api-key", apiKey);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      body: outbound,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the identification service." },
      { status: 502 }
    );
  }

  const responseText = await response.text();
  let payload: unknown = null;
  try {
    payload = responseText ? JSON.parse(responseText) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const hint =
      response.status === 401 || response.status === 403
        ? "Your API key may be invalid or restricted."
        : "Identification failed. Try a clearer image.";

    return NextResponse.json(
      {
        error: hint,
        status: response.status,
        details:
          asResponse(payload)?.message ||
          asResponse(payload)?.error ||
          responseText ||
          null,
      },
      { status: 502 }
    );
  }

  const results = normalizeResults(payload);
  const enriched = await Promise.allSettled(
    results.map(async (result) => {
      const image = await fetchInatImage(result.species);
      return image
        ? { ...result, image: { url: image, source: "inat" } }
        : result;
    })
  );
  const finalResults = enriched.map((entry, index) =>
    entry.status === "fulfilled" ? entry.value : results[index]
  );

  return NextResponse.json({ results: finalResults });
}
