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
    <div className={cn("flex gap-4 items-center", className)} {...props}>
      <div className="flex flex-row items-center gap-2 w-sm max-w-sm">
        <input
          id="result-count"
          type="range"
          min={1}
          max={100}
          step={5}
          value={sliderValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer "
        />
        <span className="text-sm">{sliderValue}</span>
      </div>
      <button
        type="button"
        className="bg-blue-700 w-fit px-2 py-1 hover:bg-blue-600 transition-colors"
        onClick={handleSetQueryParams}
      >
        update
      </button>
    </div>
  );
};

export { Root, ResultCount };
