"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const Root = ({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSetQueryParams = (_: { q: string }, formData: FormData) => {
    const query = (formData.get("q") as string) || "";
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);

    return { q: query };
  };

  const [, formAction] = React.useActionState(handleSetQueryParams, {
    q: "",
  });

  return (
    <form
      action={formAction}
      className={cn("flex gap-4", className)}
      {...props}
    />
  );
};

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const searchParams = useSearchParams();
  const current = searchParams.get("q") || "";
  const [value, setValue] = React.useState(current);

  React.useEffect(() => {
    setValue(current);
  }, [current]);

  return (
    <input
      type="search"
      name="q"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search organisms..."
      className={cn(
        "p-4 text-black rounded-lg w-full bg-white/80 hover:bg-white focus:bg-white text-center transition-colors text-2xl font-bold",
        className
      )}
      {...props}
    />
  );
};

const Button = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="submit"
      className={cn(
        "bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-12 transition-colors",
        className
      )}
      {...props}
    >
      Submit
    </button>
  );
};

export { Root, Input, Button };
