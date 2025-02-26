"use client";

import { useFormStatus } from "react-dom";

export const SearchingMessage = ({
  defaultQuery,
}: {
  defaultQuery?: string;
}) => {
  const { data } = useFormStatus();
  const query = (data?.get("q") as string) || defaultQuery;
  return query ? <SearchParamMessage query={query} /> : null;
};

export const SearchParamMessage = ({ query }: { query?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-3xl font-bold">
      🕵️‍♀️ Hunting{query ? ` for ${query}` : ""}...
    </div>
  );
};
