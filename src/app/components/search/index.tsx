"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";

export const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSetQueryParams = (_: { q: string }, formData: FormData) => {
    const query = formData.get("q") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);

    return { q: query };
  };

  const [, formAction, pending] = useActionState(handleSetQueryParams, {
    q: "",
  });

  return (
    <div className="flex gap-4">
      <input
        type="search"
        name="q"
        defaultValue={searchParams.get("q") || ""}
        placeholder="Search organisms..."
        className="p-4 text-black rounded-lg w-full bg-white/80 hover:bg-white focus:bg-white text-center transition-colors text-2xl font-bold"
      />

      <button
        className="bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-12 transition-colors sr-only"
        formAction={formAction}
      >
        {pending ? "Searching..." : "Submit"}
      </button>
    </div>
  );
};
