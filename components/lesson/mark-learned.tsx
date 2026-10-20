'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Check } from 'lucide-react';
import { load, save, schedule, daysUntil, type ReviewState } from '@/lib/review';

export function MarkLearned({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<ReviewState | null>(null);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => setState(load()), []);

  const item = state?.[url];

  return (
    <div className="not-prose my-10 flex flex-col gap-4 rounded-2xl border border-fd-primary/25 bg-gradient-to-br from-fd-primary/10 via-fd-card to-fd-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 text-sm">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fd-primary/15 text-fd-primary">
          <GraduationCap className="size-5" aria-hidden />
        </span>
        <div>
        <p className="font-semibold text-fd-foreground">Done reading?</p>
        <p className="text-fd-muted-foreground">
          {item
            ? Number.isFinite(item.due)
              ? `Next review in ${daysUntil(item.due)} day(s). `
              : 'You finished all reviews for this lesson. '
            : 'Mark it learned and the site will remind you to review it before you forget. '}
          <Link href="/review" className="underline">
            Review page
          </Link>
          {!storageOk && ' — your browser blocked storage, so this won’t be saved.'}
        </p>
        </div>
      </div>
      <button
        type="button"
        disabled={!state || !!item}
        onClick={() => {
          if (!state) return;
          const next = schedule(state, url, title);
          setStorageOk(save(next));
          setState(next);
        }}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {item ? <Check className="size-4" aria-hidden /> : <GraduationCap className="size-4" aria-hidden />}
        {item ? 'Learned' : 'Mark as learned'}
      </button>
    </div>
  );
}
