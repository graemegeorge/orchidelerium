import { Results } from "@/components/results";
import React from "react";
import * as Search from "@/components/search";
import * as Filters from "@/components/filters";
import { SearchParamMessage, SearchingMessage } from "@/components/results-client";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q, per_page } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  const perPage = Array.isArray(per_page) ? per_page[0] : per_page;
  return (
    <div>
      <main className="min-h-screen">
        <div className="sticky top-0 p-4 z-50 bg-white/20">
          <div className="flex flex-col gap-4">
            <Search.Root>
              <Search.Input />
              <Search.Button className="sr-only" />
              <SearchingMessage />
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
          <React.Suspense
            fallback={<SearchParamMessage query={query || ""} />}
          >
            <Results query={query || ""} per_page={perPage || "25"} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
