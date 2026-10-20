import type { ReactNode } from 'react';
import { Lightbulb, Brain } from 'lucide-react';

export function Analogy({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-xl border border-sky-500/40 bg-sky-500/5 p-4 [&>p:first-of-type]:mt-0 [&>p:last-child]:mb-0">
      <p className="not-prose mb-2 flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
        <Lightbulb className="size-4" aria-hidden /> Analogy
      </p>
      {children}
    </aside>
  );
}

export function Remember({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 [&_ul]:my-0">
      <p className="not-prose mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <Brain className="size-4" aria-hidden /> Remember this
      </p>
      {children}
    </aside>
  );
}
