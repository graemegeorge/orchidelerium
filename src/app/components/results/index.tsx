import Image from "next/image";
import { Result } from "./types";
import { ButtonLink } from "../button";

const fetchQuery = async ({ q }: { q: string }) => {
  const response = await fetch(
    `https://www.inaturalist.org/observations.json?q=${q}&page=1&per_page=10&has[]=photos`,
    {
      cache: "force-cache",
    }
  );
  return response.json();
};

export const Results = async ({ query }: { query: string }) => {
  const response = query ? await fetchQuery({ q: query }) : null;
  return (
    <div className="flex flex-col gap-8">
      {response?.map((result: Result) => {
        return (
          <div key={result.id} className="flex flex-col gap-8 items-center">
            <div className="flex flex-col md:flex-row gap-2 md:items-end">
              <h1 className="text-3xl italic">{result.taxon.name}</h1>
              <span className="text-lg">({result.species_guess})</span>
            </div>

            <div className="flex gap-4 overflow-auto">
              {result.photos?.map((photo) => {
                return (
                  <div key={photo.id} className="w-72 h-72 relative">
                    <Image
                      key={photo.id}
                      src={photo.medium_url}
                      alt={result.species_guess || result.taxon.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 items-center">
              {result.user.user_icon_url ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={result.user.user_icon_url}
                    alt={result.user.login}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : null}

              <div>
                Observed by <span className="italic">{result.user.login}</span>
              </div>
            </div>

            <ButtonLink
              className="bg-blue-700 w-fit p-4 hover:bg-blue-600 transition-colors"
              href={result.uri}
              target="_blank"
            >
              View observation
            </ButtonLink>
          </div>
        );
      })}
    </div>
  );
};
