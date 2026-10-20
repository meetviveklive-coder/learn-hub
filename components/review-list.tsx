'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { load, save, review, dueItems, upcoming, daysUntil, type ReviewState } from '@/lib/review';

export function ReviewList() {
  const [state, setState] = useState<ReviewState | null>(null);
  useEffect(() => setState(load()), []);

  if (!state) return <p className="text-fd-muted-foreground">Loading…</p>;

  const due = dueItems(state);
  const next = upcoming(state).slice(0, 10);
  const total = Object.keys(state).length;

  const act = (url: string, remembered: boolean) => {
    const s = review(state, url, remembered);
    save(s);
    setState(s);
  };

  if (total === 0) {
    return (
      <div className="rounded-xl border bg-fd-card p-6 text-sm">
        <p className="font-medium">Nothing to review yet.</p>
        <p className="mt-1 text-fd-muted-foreground">
          Open a lesson and press <b>Mark as learned</b> at the bottom. It will show up here in 1, 3, 7, 16 and 35
          days. Your schedule is saved in this browser only — another device or a private window starts empty.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Due today ({due.length})</h2>
        {due.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">All caught up. Come back tomorrow.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {due.map((i) => (
              <li key={i.url} className="flex flex-col gap-3 rounded-xl border bg-fd-card p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Link href={i.url} className="font-medium underline">
                    {i.title}
                  </Link>
                  <p className="text-xs text-fd-muted-foreground">
                    Review {i.step + 1} of 5 — re-read the “Remember this” box and retake the quiz.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => act(i.url, true)} className="rounded-lg bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground">
                    I remembered
                  </button>
                  <button onClick={() => act(i.url, false)} className="rounded-lg border px-3 py-2 text-sm hover:bg-fd-accent">
                    I forgot
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {next.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Coming up</h2>
          <ul className="divide-y rounded-xl border text-sm">
            {next.map((i) => (
              <li key={i.url} className="flex justify-between gap-4 p-3">
                <Link href={i.url} className="underline">
                  {i.title}
                </Link>
                <span className="shrink-0 text-fd-muted-foreground">in {daysUntil(i.due)} day(s)</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
