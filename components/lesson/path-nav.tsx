'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Route } from 'lucide-react';
import { load as loadReviews } from '@/lib/review';
import {
  PROGRESS_EVENT,
  isDone,
  loadProgress,
  saveProgress,
  setDone,
  summary,
  type PathProgress,
} from '@/lib/path-progress';

type Neighbour = { url: string; title: string } | null;

export type PathNavProps = {
  url: string;
  position: number; // 1-based place of this lesson on the path
  stageTitle: string;
  urls: string[]; // every lesson on the path, in order
  prev: Neighbour;
  next: Neighbour;
  /** `panel` sits under "On this page" (wide screens); `inline` goes in the page body (narrow screens). */
  variant?: 'panel' | 'inline';
};

/** Previous lesson, path progress, and next lesson, following the AI Architect learning path order. */
export function PathNav({ url, position, stageTitle, urls, prev, next, variant = 'panel' }: PathNavProps) {
  const [progress, setProgress] = useState<PathProgress | null>(null);
  const [learned, setLearned] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const refresh = () => {
      setProgress(loadProgress());
      setLearned(new Set(Object.keys(loadReviews())));
    };
    refresh();
    // Same-tab saves (Mark as learned, this toggle) fire PROGRESS_EVENT; other tabs fire "storage".
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const p = progress ?? {};
  const { done, total, percent } = summary(urls, p, learned);
  const thisDone = isDone(url, p, learned);
  const ready = progress !== null;

  const panel = variant === 'panel';

  return (
    <nav
      aria-label="Learning path"
      className={
        panel
          ? 'not-prose mt-6 flex flex-col gap-2 rounded-2xl border bg-fd-card p-3 text-sm shadow-sm'
          : 'not-prose my-8 grid gap-2 rounded-2xl border bg-fd-card p-3 text-sm shadow-sm sm:grid-cols-[1fr_auto_1fr] sm:items-stretch xl:hidden'
      }
    >
      {panel && (
        <Link
          href="/path"
          className="inline-flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground hover:text-fd-primary"
        >
          <Route className="size-3.5" aria-hidden /> Learning path
        </Link>
      )}

      <NeighbourLink item={prev} dir="prev" />

      <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-fd-primary/[0.06] px-3 py-3 text-center">
        <ProgressRing percent={ready ? percent : 0} />
        <div>
          <p className="text-xs font-medium text-fd-foreground">
            {ready ? `${done} of ${total} done` : 'Loading…'}
          </p>
          <p className="text-[11px] text-fd-muted-foreground">
            Lesson {position} of {total} · {stageTitle}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-fd-muted-foreground">
          <input
            type="checkbox"
            checked={thisDone}
            disabled={!ready}
            onChange={(e) => {
              const updated = setDone(p, url, e.target.checked);
              saveProgress(updated);
              setProgress(updated);
            }}
            className="size-4 cursor-pointer accent-fd-primary"
          />
          Done on path
        </label>
      </div>

      <NeighbourLink item={next} dir="next" />
    </nav>
  );
}

function NeighbourLink({ item, dir }: { item: Neighbour; dir: 'prev' | 'next' }) {
  const isPrev = dir === 'prev';
  const label = isPrev ? 'Previous topic' : 'Next topic';
  if (!item) {
    return (
      <div className="rounded-xl border border-dashed px-3 py-2.5 text-xs text-fd-muted-foreground">
        {isPrev ? 'This is the first lesson on the path.' : 'Last lesson on the path. Well done!'}
      </div>
    );
  }
  const Icon = isPrev ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={item.url}
      className="group flex items-start gap-2 rounded-xl border px-3 py-2.5 transition hover:border-fd-primary/40 hover:bg-fd-accent"
    >
      <Icon
        className={`mt-0.5 size-4 shrink-0 text-fd-muted-foreground transition group-hover:text-fd-primary ${
          isPrev ? '' : 'order-last ms-auto group-hover:translate-x-0.5'
        }`}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-fd-muted-foreground">{label}</span>
        <span className="line-clamp-2 font-medium leading-snug text-fd-foreground group-hover:text-fd-primary">
          {item.title}
        </span>
      </span>
    </Link>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const gradientId = useId();
  return (
    <div
      role="progressbar"
      aria-label="Learning path progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="relative size-16"
    >
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" stroke="currentColor" className="text-fd-foreground/10" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={c}
          strokeDashoffset={c - (percent / 100) * c}
          className="transition-[stroke-dashoffset] duration-500"
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums">
        {percent}%
      </span>
    </div>
  );
}
