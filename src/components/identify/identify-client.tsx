"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Camera, RefreshCcw, UploadCloud, Sparkles } from "lucide-react";

const MAX_IMAGES = 5;

interface IdentifyResult {
  species: string;
  score: number;
  genus?: string | null;
  family?: string | null;
  images: Array<{ url: string; source?: string | null }>;
}

interface IdentifyResponse {
  results: IdentifyResult[];
}

const formatScore = (score: number) => {
  if (Number.isNaN(score)) return "–";
  return `${Math.round(score * 100)}%`;
};

export const IdentifyClient = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<IdentifyResult[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleEnableCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError(
        "Camera access was blocked. You can still upload a photo instead."
      );
      setCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const appendFiles = (newFiles: File[]) => {
    const filtered = newFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
    const next = [...files, ...filtered].slice(0, MAX_IMAGES);
    const urls = next.map((file) => URL.createObjectURL(file));
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles(next);
    setPreviewUrls(urls);
    setResults(null);
    setError(null);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) return;

    const file = new File([blob], `capture-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    appendFiles([file]);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    appendFiles(Array.from(event.target.files));
    event.target.value = "";
  };

  const handleClear = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setResults(null);
    setError(null);
  };

  const handleIdentify = async () => {
    if (!files.length || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as IdentifyResponse & {
        error?: string;
        details?: string | null;
        status?: number;
      };

      if (!response.ok) {
        const detail = payload.details ? ` (${payload.details})` : "";
        throw new Error(
          `${payload.error || "Unable to identify this image."}${detail}`
        );
      }

      setResults(payload.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't identify that image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-6 shadow-[var(--glow)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Field Capture
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--fg)]">
              Frame the plant and capture a clean shot
            </h2>
          </div>
          <div className="h-12 w-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/70 flex items-center justify-center">
            <Camera className="text-[var(--accent)]" size={20} />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/80">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border border-dashed border-[var(--accent-2)]/50 rounded-2xl" />
            </div>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-[320px] w-full object-cover"
            />
            {!cameraActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-[var(--muted)]">
                  Camera inactive. Enable it for live capture.
                </p>
                <button
                  onClick={handleEnableCamera}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 py-2 text-sm text-[var(--fg)] hover:bg-[var(--bg-elev)] transition-colors"
                  type="button"
                >
                  <Camera size={16} />
                  Enable camera
                </button>
              </div>
            ) : null}
          </div>

          {cameraError ? (
            <p className="text-sm text-amber-200/90">{cameraError}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCapture}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm",
                "bg-[var(--accent)] text-black hover:brightness-110 transition-all",
                !cameraActive && "opacity-50 pointer-events-none"
              )}
              type="button"
            >
              <Camera size={16} />
              Capture
            </button>
            <button
              onClick={handleStopCamera}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm",
                "hover:bg-[var(--bg-elev)] transition-colors",
                !cameraActive && "opacity-50 pointer-events-none"
              )}
              type="button"
            >
              <RefreshCcw size={16} />
              Stop camera
            </button>
            <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--bg-elev)] transition-colors cursor-pointer">
              <UploadCloud size={16} />
              Upload
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted)]">
                {files.length
                  ? `${files.length} image${files.length === 1 ? "" : "s"} ready`
                  : "No images selected"}
              </p>
              <button
                onClick={handleClear}
                className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--accent)]"
                type="button"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previewUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-[var(--border)]"
                >
                  <Image
                    src={url}
                    alt={`Selected plant ${index + 1}`}
                    className="h-28 w-full object-cover"
                    width={200}
                    height={112}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleIdentify}
            disabled={!files.length || loading}
            className={cn(
              "mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm",
              "bg-[var(--accent-2)] text-black hover:brightness-110 transition-all",
              (!files.length || loading) && "opacity-50 pointer-events-none"
            )}
            type="button"
          >
            <Sparkles size={16} />
            {loading ? "Identifying…" : "Identify plant"}
          </button>

          {error ? (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]/60 p-3 text-xs text-[var(--muted)]">
            If you see authorization errors, check your Pl@ntNet API key settings.
            When “expose my API key” is enabled, you must add your server’s
            public IP under “Authorized IPs,” or disable exposure for server
            requests.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/80 p-6 shadow-[var(--glow)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Results
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--fg)]">
              Suggested matches
            </h2>
          </div>
          <div className="h-12 w-12 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/70 flex items-center justify-center">
            <Sparkles className="text-[var(--accent-2)]" size={20} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {!results ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
              Upload a photo to see suggested species with confidence scores.
            </div>
          ) : null}
          {results && results.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 text-sm text-[var(--muted)]">
              No suggestions returned. Try a sharper, closer photo with more
              leaf detail.
            </div>
          ) : null}

          {results?.map((result, index) => (
            <div
              key={`${result.species}-${index}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[var(--fg)]">
                    {result.species}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Confidence {formatScore(result.score)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {result.genus ? `${result.genus} · ` : ""}
                    {result.family ?? ""}
                  </p>
                </div>
                <span className="text-xs rounded-full border border-[var(--border)] px-2 py-1 text-[var(--muted)]">
                  #{index + 1}
                </span>
              </div>

              {result.images?.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {result.images.slice(0, 3).map((image, imageIndex) => (
                    <div
                      key={`${image.url}-${imageIndex}`}
                      className="relative overflow-hidden rounded-xl border border-[var(--border)]"
                    >
                      <Image
                        src={image.url}
                        alt={result.species}
                        className="h-20 w-full object-cover"
                        width={200}
                        height={80}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-[var(--muted)]">
          Powered by{" "}
          <a
            href="https://my.plantnet.org"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent-2)] hover:text-[var(--accent)]"
          >
            Pl@ntNet
          </a>
        </div>
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
