import { AlertTriangle, CalendarCheck, Clock, ExternalLink } from 'lucide-react';

type Source = { title: string; url: string; type: string };

const fmt = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function LessonBadges({
  level,
  minutes,
  lastVerified,
}: {
  level?: string;
  minutes?: number;
  lastVerified?: Date;
}) {
  if (!level && !minutes && !lastVerified) return null;
  return (
    <div className="not-prose flex flex-wrap gap-2 text-xs text-fd-muted-foreground">
      {level && <span className="rounded-full border px-2 py-0.5 capitalize">{level}</span>}
      {minutes && (
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
          <Clock className="size-3" aria-hidden /> {minutes} min read
        </span>
      )}
      {lastVerified && (
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
          <CalendarCheck className="size-3" aria-hidden /> Verified {fmt(lastVerified)}
        </span>
      )}
    </div>
  );
}

export function OutdatedBanner() {
  return (
    <div role="alert" className="not-prose my-4 flex gap-2 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden />
      <p>Some facts on this page may be out of date. It is queued for a refresh.</p>
    </div>
  );
}

export function SourcesList({ sources, lastVerified }: { sources: Source[]; lastVerified?: Date }) {
  if (!sources.length) return null;
  return (
    <section className="not-prose mt-10 border-t pt-6 text-sm">
      <h2 className="mb-2 font-semibold">Sources</h2>
      {lastVerified && (
        <p className="mb-3 text-fd-muted-foreground">Facts last checked against these on {fmt(lastVerified)}.</p>
      )}
      <ul className="flex flex-col gap-1.5">
        {sources.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span className="mt-0.5 rounded border px-1.5 text-[10px] uppercase tracking-wide text-fd-muted-foreground">
              {s.type}
            </span>
            <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
              {s.title} <ExternalLink className="size-3" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
