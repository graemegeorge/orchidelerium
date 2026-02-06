"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm opacity-80">
        Please try again. If this keeps happening, the service may be down.
      </p>
      <button
        className="mt-4 bg-black text-white px-4 py-2 rounded"
        onClick={reset}
      >
        Retry
      </button>
    </div>
  );
}
