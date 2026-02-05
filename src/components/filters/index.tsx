"use client";

import { LAST_50_YEARS, MONTHS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { HTMLAttributes, useState } from "react";

const Root = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} />;
};

const ResultCount = ({ className = "", defaultCount = "25", ...props }) => {
  const currCount = useSearchParams().get("per_page");
  const [sliderValue, setSliderValue] = useState(currCount || defaultCount);

  return (
    <div className={cn("flex gap-4 items-center", className)} {...props}>
      <input
        id="result-count"
        type="range"
        min={0}
        max={100}
        name="per_page"
        step={5}
        value={sliderValue}
        onChange={(event) => setSliderValue(event.target.value)}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer "
      />
      <span className="text-sm">{sliderValue}</span>
    </div>
  );
};

const Month = ({ className, ...props }: HTMLAttributes<HTMLSelectElement>) => {
  const [month, setMonth] = useState(useSearchParams().get("month") || "");
  return (
    <select
      name="month"
      className={cn(
        "bg-blue-700 w-fit px-2 py-1 hover:bg-blue-600 transition-colors",
        className
      )}
      value={month}
      onChange={(event) => setMonth(event.target.value)}
      {...props}
    >
      <option value="">Select a month</option>
      {MONTHS.map((month, index) => (
        <option value={index + 1} key={month}>
          {month}
        </option>
      ))}
    </select>
  );
};

const Year = ({ className, ...props }: HTMLAttributes<HTMLSelectElement>) => {
  const [year, setYear] = useState(useSearchParams().get("year") || "");
  return (
    <select
      name="year"
      className={cn(
        "bg-blue-700 w-fit px-2 py-1 hover:bg-blue-600 transition-colors",
        className
      )}
      value={year}
      onChange={(event) => setYear(event.target.value)}
      {...props}
    >
      <option value="">Select a year</option>
      {LAST_50_YEARS.map((year) => (
        <option value={year} key={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export { Root, ResultCount, Month, Year };
