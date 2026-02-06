"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, HtmlHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface SearchMessageProps extends HTMLAttributes<HTMLDivElement> {
  defaultQuery?: string;
}
export const SearchingMessage = ({
  defaultQuery,
  ...props
}: SearchMessageProps) => {
  const { data, pending } = useFormStatus();
  const query = (data?.get("q") as string) || defaultQuery;
  return pending && query ? (
    <SearchParamMessage query={query} {...props} />
  ) : null;
};

interface SearchParamMessageProps extends HtmlHTMLAttributes<HTMLDivElement> {
  query?: string;
}
export const SearchParamMessage = ({
  className,
  query,
}: SearchParamMessageProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-xl font-bold text-center sm:text-2xl md:text-3xl",
        className
      )}
      role="status"
      aria-live="polite"
    >
      Searching{query ? ` for ${query}` : ""}...
    </div>
  );
};
