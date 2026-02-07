"use client";

import * as React from "react";
import * as Search from "@/components/search";
import { cn } from "@/lib/utils";

export const LandingSearch = () => {
  const [active, setActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleBackdrop = () => {
    inputRef.current?.blur();
    setActive(false);
  };

  return (
    <div className="relative w-full">
      {active ? (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onMouseDown={handleBackdrop}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={cn(
          "relative z-40 transition-transform duration-300",
          active ? "scale-[1.02]" : "scale-100"
        )}
      >
        <Search.Root className="w-full">
          <Search.Input
            ref={inputRef}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            className={cn(
              "w-full text-center text-2xl md:text-3xl",
              "py-5 md:py-6"
            )}
          />
          <Search.Button className="sr-only">Search</Search.Button>
        </Search.Root>
      </div>
    </div>
  );
};
