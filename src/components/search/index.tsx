"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, objectToSearchParams } from "@/lib/utils";

const Root = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex gap-4", className)} {...props} />
);

const Input = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLInputElement>) => (
  <input
    type="search"
    name="query"
    defaultValue={useSearchParams().get("query") || ""}
    placeholder="Search organisms..."
    className={cn(
      "p-4 text-black rounded-lg w-full bg-white/80 hover:bg-white focus:bg-white text-center transition-colors text-2xl font-bold",
      className
    )}
    {...props}
  />
);

const Button = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSetQueryParams = (_: { query: string }, formData: FormData) => {
    const query = formData.get("query") as string;
    const per_page = formData.get("per_page") as string;
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;

    const params = objectToSearchParams({
      query,
      per_page,
      month,
      year,
    });

    console.log(`${pathname}?${params}`);

    replace(`${pathname}?${params}`);

    return { query };
  };

  const [, formAction, pending] = React.useActionState(handleSetQueryParams, {
    query: "",
  });

  return (
    <button
      className={cn(
        "bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-12 transition-colors",
        className
      )}
      {...props}
      formAction={formAction}
    >
      {pending ? "Searching..." : "Submit"}
    </button>
  );
};

export { Root, Input, Button };
