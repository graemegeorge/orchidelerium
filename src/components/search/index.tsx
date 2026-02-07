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

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
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
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search flora and fauna..."
      className={cn(
        "w-full rounded-lg px-6 py-4 text-lg md:text-xl",
        "bg-[var(--bg-elev)]/90 hover:bg-[var(--bg-elev)] focus:bg-[var(--bg-elev)]",
        "text-[var(--fg)] placeholder:text-[var(--muted)]",
        "border border-[var(--border)] shadow-[var(--glow)]",
        "transition-all focus:ring-2 focus:ring-[var(--accent)]/40 outline-none",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "SearchInput";

const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="submit"
      className={cn(
        "bg-[var(--accent)] text-black px-8 py-3 rounded-lg",
        "hover:brightness-110 transition-all",
        className
      )}
      {...props}
    >
      {children ?? "Search"}
    </button>
  );
};

export { Root, Input, Button };
