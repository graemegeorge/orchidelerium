import Link from "next/link";
import { IdentifyClient } from "@/components/identify/identify-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Camera } from "lucide-react";

export default function IdentifyPage() {
  return (
    <div className="min-h-screen">
      <main className="min-h-screen relative z-10">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Link
                  href="/"
                  className="font-display text-2xl md:text-3xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                >
                  Canopy
                </Link>
                <div className="text-xs tracking-[0.18em] text-[var(--muted)]">
                  field companion
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)]/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                <Camera size={14} className="text-[var(--accent-2)]" />
                Identify
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-12">
          <section className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Plant Identification
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-[var(--fg)]">
              Turn a leaf, petal, or canopy into a confident guess.
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-[var(--muted)]">
              Capture a clear image and we will compare it against Pl@ntNet’s
              global flora index. The more detail you can frame, the better the
              match.
            </p>
          </section>

          <IdentifyClient />
        </div>
      </main>
    </div>
  );
}
