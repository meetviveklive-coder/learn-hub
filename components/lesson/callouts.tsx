import type { ReactNode } from 'react';
import { Lightbulb, Brain } from 'lucide-react';

export function Analogy({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-xl border border-sky-500/30 border-l-4 border-l-sky-500 bg-sky-500/[0.06] p-5 [&>p:first-of-type]:mt-0 [&>p:last-child]:mb-0">
      <p className="not-prose mb-3 flex items-center gap-2 text-sm font-semibold text-sky-800 dark:text-sky-300">
        <span className="flex size-6 items-center justify-center rounded-md bg-sky-500/15">
          <Lightbulb className="size-3.5" aria-hidden />
        </span>
        Analogy
      </p>
      {children}
    </aside>
  );
}

export function Remember({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-xl border border-emerald-500/30 border-l-4 border-l-emerald-500 bg-emerald-500/[0.06] p-5 [&_ul]:my-0 [&_li]:my-1.5">
      <p className="not-prose mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        <span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/15">
          <Brain className="size-3.5" aria-hidden />
        </span>
        Remember this
      </p>
      {children}
    </aside>
  );
}
