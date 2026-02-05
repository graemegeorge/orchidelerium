import { Results } from "@/components/results";
import React from "react";
import * as Search from "@/components/search";
import * as Filters from "@/components/filters";
import { SearchingMessage } from "@/components/results-client";

interface HomeProps {
  searchParams: Promise<
    Record<"query" | "per_page" | "month" | "year", string>
  >;
}

export default async function Home({ searchParams }: HomeProps) {
  const { query, ...params } = await searchParams;
  return (
    <div>
      <main className="h-100vh">
        <div className="sticky top-0 p-4 z-50 bg-white/20">
          <form className="flex flex-col gap-4">
            <Search.Root>
              <Search.Input />
              <Search.Button />
            </Search.Root>

            <Filters.Root className="flex gap-4">
              <Filters.ResultCount />
              <Filters.Month />
              <Filters.Year />
            </Filters.Root>
          </form>
        </div>

        {/* <div className="p-4">
            <Map />
          </div> */}

        <div className="p-4">
          <SearchingMessage />

          {query ? (
            <React.Suspense
              fallback={<SearchingMessage defaultQuery={query || ""} />}
            >
              <Results query={query} {...params} />
            </React.Suspense>
          ) : null}
        </div>
      </main>
    </div>
  );
}
