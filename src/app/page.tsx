import { Results } from "./components/results";
import React from "react";
import { Search } from "./components/search";
import { SearchingMessage } from "./components/results-client";

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  return (
    <div>
      <main className="">
        <form>
          <div className="sticky top-0 p-4 z-50 bg-white/20">
            <Search />
          </div>

          <div className="p-4">
            <SearchingMessage />

            <React.Suspense
              fallback={<SearchingMessage defaultQuery={(q as string) || ""} />}
            >
              <Results query={(q as string) || ""} />
            </React.Suspense>
          </div>
        </form>
      </main>
    </div>
  );
}
