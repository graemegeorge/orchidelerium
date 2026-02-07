"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes, useCallback, useEffect, useState } from "react";

const Root = (props: HTMLAttributes<HTMLDivElement>) => {
  const searchParams = useSearchParams();
  return searchParams.get("q") ? <div {...props} /> : null;
};

const ResultCount = ({ className = "", defaultCount = "25", ...props }) => {
  const searchParams = useSearchParams();
  const currPerPage = searchParams.get("per_page");
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sliderValue, setSliderValue] = useState(currPerPage || defaultCount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSliderValue(newValue);
  };

  const handleSetQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const nextValue = Math.max(1, Math.min(100, Number(sliderValue) || 25));
    params.set("per_page", String(nextValue));
    replace(`${pathname}?${params.toString()}`);
  }, [sliderValue, pathname, searchParams, replace]);

  useEffect(() => {
    if (!searchParams.get("per_page")) {
      handleSetQueryParams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onMount
  }, []);

  useEffect(() => {
    const next = searchParams.get("per_page");
    if (next && next !== sliderValue) {
      setSliderValue(next);
    }
  }, [searchParams, sliderValue]);

  return (
    <div
      className={cn(
        "flex flex-wrap gap-4 items-center text-sm text-[var(--muted)]",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-3 w-sm max-w-sm">
        <input
          id="result-count"
          type="range"
          min={1}
          max={100}
          step={5}
          value={sliderValue}
          onChange={handleChange}
          className="w-full h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
        />
        <span className="text-sm text-[var(--fg)]">{sliderValue}</span>
      </div>
      <button
        type="button"
        className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-elev)] transition-colors"
        onClick={handleSetQueryParams}
      >
        update
      </button>
    </div>
  );
};

export { Root, ResultCount };
