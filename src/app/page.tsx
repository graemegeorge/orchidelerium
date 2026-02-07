import { Results } from "@/components/results";
import React from "react";
import Link from "next/link";
import * as Search from "@/components/search";
import * as Filters from "@/components/filters";
import {
  SearchParamMessage,
  SearchingMessage,
} from "@/components/results-client";
import { LandingSearch } from "@/components/landing-search";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Leaf,
  Users,
  Camera,
  Sparkles,
  Globe2,
} from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q, per_page } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  const perPage = Array.isArray(per_page) ? per_page[0] : per_page;
  const hasQuery = Boolean(query);
  return (
    <div className="min-h-screen">
      <main className="min-h-screen relative z-10">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4 flex-1">
              <div>
                <Link
                  href="/"
                  className="font-display text-2xl md:text-3xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                >
                  orchidelerium
                </Link>
                <div className="text-xs tracking-[0.18em] text-[var(--muted)]">
                  field companion
                </div>
              </div>
            </div>

            {hasQuery ? (
              <div className="flex-1 md:max-w-2xl">
                <Search.Root className="w-full">
                  <Search.Input className="py-3 md:py-3 text-sm md:text-base text-left bg-[var(--card)]/90 text-[var(--fg)] placeholder:text-[var(--muted)]" />
                  <Search.Button className="sr-only" />
                  <SearchingMessage />
                </Search.Root>
              </div>
            ) : null}

            <ThemeToggle />
          </div>
        </header>

        {!hasQuery ? (
          <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-8">
              <div className="max-w-3xl">
                <p className="text-sm tracking-[0.2em] text-[var(--muted)]">
                  Fast identification aid
                </p>
                <h1 className="mt-6 text-4xl md:text-6xl font-semibold text-[var(--fg)]">
                  <span className="font-script text-[var(--accent)]">
                    A quiet, fast way
                  </span>{" "}
                  to compare{" "}
                  <span className="text-[var(--accent-2)]">flora</span> and{" "}
                  <span className="text-[var(--accent-3)]">fauna</span> in the
                  wild.
                </h1>
                <p className="mt-5 text-base md:text-lg text-[var(--muted)]">
                  orchidelerium uses the iNaturalist API to pull clean, real
                  observation photos so you can scan examples side-by-side and
                  make confident identifications.
                </p>
              </div>

              <div className="w-full max-w-3xl">
                <LandingSearch />
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Try: “orchis apifera”, “bombus terrestris”, “acer palmatum”
                </p>
              </div>
            </section>

            <section className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "What it is",
                  body: "A focused search tool for fieldwork, giving you a visual catalog of real observations in seconds.",
                  icon: Leaf,
                },
                {
                  title: "Who it is for",
                  body: "Naturalists, hikers, botanists, biologists, and anyone who wants a fast visual check before making a call.",
                  icon: Users,
                },
                {
                  title: "Why it helps",
                  body: "You get a dense grid of photos for quick comparison, perfect for on-phone scans while you are outdoors.",
                  icon: Camera,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)]/80 p-6 shadow-[var(--glow)]"
                >
                  <div className="flex items-center gap-3 text-[var(--fg)]">
                    <div className="h-10 w-10 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)]/80 flex items-center justify-center text-[var(--accent)]">
                      <item.icon size={18} />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-10 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)]/80 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 text-[var(--fg)]">
                    <Sparkles size={18} className="text-[var(--accent-2)]" />
                    <h3 className="text-lg font-semibold">
                      Powered by iNaturalist
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    All imagery and observations are sourced from the
                    iNaturalist community.
                  </p>
                </div>
                <a
                  href="https://www.inaturalist.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--fg)] hover:bg-[var(--card)] transition-colors"
                >
                  <Globe2 size={16} className="text-[var(--accent)]" />
                  Visit iNaturalist
                </a>
              </div>
            </section>
          </div>
        ) : null}

        {hasQuery ? (
          <div className="mx-auto max-w-6xl px-6 py-6">
            <Filters.Root>
              <Filters.ResultCount />
            </Filters.Root>
          </div>
        ) : null}

        <div className="mx-auto max-w-6xl px-6 pb-20">
          <React.Suspense
            fallback={<SearchParamMessage query={query || ""} />}
          >
            <Results query={query || ""} per_page={perPage || "25"} />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
