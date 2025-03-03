import { Results } from "@/components/results";
import React from "react";
import * as Search from "@/components/search";
import * as Filters from "@/components/filters";
import {
  SearchingMessage,
  SearchParamMessage,
} from "@/components/results-client";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q, per_page } = await searchParams;
  return (
    <div>
      <main className="h-100vh">
        <form>
          <div className="sticky top-0 p-4 z-50 bg-white/20">
            <div className="flex flex-col gap-4">
              <Search.Root>
                <Search.Input />
                <Search.Button className="sr-only" />
              </Search.Root>

              <Filters.Root>
                <Filters.ResultCount />
              </Filters.Root>
            </div>
          </div>

          {/* <div className="p-4">
            <Map />
          </div> */}

          <div className="p-4">
            <SearchingMessage />

            <React.Suspense
              fallback={<SearchingMessage defaultQuery={(q as string) || ""} />}
            >
              <Results
                query={(q as string) || ""}
                per_page={String(per_page)}
              />
            </React.Suspense>
          </div>
        </form>
      </main>
    </div>
  );
}
