"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
    name="q"
    defaultValue={useSearchParams().get("q") || ""}
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

  const [, formAction, pending] = React.useActionState(handleSetQueryParams, {
    q: "",
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
