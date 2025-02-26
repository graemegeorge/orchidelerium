import { Results } from "./components/results";
import React from "react";
import { Search } from "./components/search";
import {
  SearchFormMessage,
  SearchingMessage,
  SearchParamMessage,
} from "./components/results-client";

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams["q"] as string;
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
              fallback={<SearchingMessage defaultQuery={query} />}
            >
              <Results query={query} />
            </React.Suspense>
          </div>
        </form>
      </main>
    </div>
  );
}
