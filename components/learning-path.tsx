'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock, RotateCcw } from 'lucide-react';
import { domainStyle, LevelPill } from '@/components/domain-meta';
import { load as loadReviews } from '@/lib/review';
import { isDone, loadProgress, saveProgress, setDone, summary, type PathProgress } from '@/lib/path-progress';

export type PathLesson = {
  url: string;
  title: string;
  description?: string;
  domain: string;
  level?: string;
  minutes?: number;
};

export type PathStageView = { id: string; title: string; goal: string; lessons: PathLesson[] };

export function LearningPath({ stages }: { stages: PathStageView[] }) {
  const [progress, setProgress] = useState<PathProgress | null>(null);
  const [learned, setLearned] = useState<ReadonlySet<string>>(new Set());
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    setProgress(loadProgress());
    setLearned(new Set(Object.keys(loadReviews())));
  }, []);

  const lessons = stages.flatMap((s) => s.lessons);
  const urls = lessons.map((l) => l.url);
  const p = progress ?? {};
  const { done, total, percent, next } = summary(urls, p, learned);
  const nextLesson = lessons.find((l) => l.url === next);
  const minutesLeft = lessons.filter((l) => !isDone(l.url, p, learned)).reduce((m, l) => m + (l.minutes ?? 0), 0);

  const toggle = (url: string, value: boolean) => {
    const updated = setDone(p, url, value);
    setStorageOk(saveProgress(updated));
    setProgress(updated);
  };

  const reset = () => {
    if (!window.confirm('Clear your progress on this path? Your review schedule is not affected.')) return;
    // Explicit `false` for every lesson so "Mark as learned" items also start unticked.
    const cleared = Object.fromEntries(urls.map((u) => [u, false]));
    setStorageOk(saveProgress(cleared));
    setProgress(cleared);
  };

  let n = 0;

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-label="Your progress"
        className="z-10 rounded-2xl sm:sticky sm:top-16 border bg-fd-card/95 p-5 shadow-sm backdrop-blur"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {progress === null ? 'Loading your progress…' : `${done} of ${total} lessons done · ${percent}%`}
            </p>
            <p className="mt-0.5 text-xs text-fd-muted-foreground">
              {nextLesson ? `About ${formatMinutes(minutesLeft)} of reading left.` : 'Path complete. Keep up your reviews.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextLesson && (
              <Link
                href={nextLesson.url}
                className="inline-flex max-w-full items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground shadow-sm hover:opacity-90"
              >
                <span className="truncate">{done === 0 ? 'Start' : 'Continue'}: {nextLesson.title}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            )}
            {done > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-fd-accent"
              >
                <RotateCcw className="size-3.5" aria-hidden /> Reset
              </button>
            )}
          </div>
        </div>
        <div
          role="progressbar"
          aria-label="Path progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="mt-4 h-2 overflow-hidden rounded-full bg-fd-muted"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-400 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {!storageOk && (
          <p className="mt-3 text-xs text-red-700 dark:text-red-300">
            Your browser blocked storage, so this progress won’t be saved.
          </p>
        )}
      </section>

      <ol className="flex flex-col gap-10">
        {stages.map((stage, si) => {
          const stageDone = stage.lessons.filter((l) => isDone(l.url, p, learned)).length;
          const complete = stageDone === stage.lessons.length;
          return (
            <li key={stage.id} aria-labelledby={`stage-${stage.id}`}>
              <div className="mb-4 flex items-start gap-3">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                    complete ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-fd-primary/10 text-fd-primary'
                  }`}
                  aria-hidden
                >
                  {complete ? <Check className="size-4" /> : si + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    Stage {si + 1} · {stageDone}/{stage.lessons.length} done{complete ? ' · complete' : ''}
                  </p>
                  <h2 id={`stage-${stage.id}`} className="text-xl font-semibold tracking-tight">
                    {stage.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-fd-muted-foreground">{stage.goal}</p>
                </div>
              </div>

              <ol className="flex flex-col gap-2 border-l-2 border-fd-border pl-4 sm:ml-4 sm:pl-6">
                {stage.lessons.map((l) => {
                  n += 1;
                  const d = domainStyle(l.domain);
                  const checked = isDone(l.url, p, learned);
                  const id = `done-${l.url.replaceAll('/', '-')}`;
                  return (
                    <li
                      key={l.url}
                      className={`flex items-start gap-3 rounded-xl border bg-fd-card p-3 shadow-sm transition sm:p-4 ${
                        checked ? 'opacity-75' : ''
                      }`}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        disabled={progress === null}
                        onChange={(e) => toggle(l.url, e.target.checked)}
                        className="mt-1 size-5 shrink-0 cursor-pointer accent-fd-primary"
                      />
                      <div className="min-w-0 flex-1">
                        <label htmlFor={id} className="sr-only">
                          Mark “{l.title}” as done
                        </label>
                        <Link href={l.url} className="font-semibold leading-snug hover:text-fd-primary">
                          <span className="mr-1.5 tabular-nums text-fd-muted-foreground">{n}.</span>
                          {l.title}
                        </Link>
                        {checked && <span className="ml-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">Done</span>}
                        {l.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-fd-muted-foreground">{l.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fd-muted-foreground">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${d.tile}`}>
                            <d.icon className="size-3" aria-hidden /> {d.label}
                          </span>
                          <LevelPill level={l.level} />
                          {l.minutes && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" aria-hidden /> {l.minutes} min
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}
