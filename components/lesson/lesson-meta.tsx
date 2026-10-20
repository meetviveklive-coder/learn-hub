import { AlertTriangle, BookMarked, CalendarCheck, Clock, ExternalLink } from 'lucide-react';
import { domainStyle, LevelPill } from '@/components/domain-meta';

type Source = { title: string; url: string; type: string };

const fmt = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function LessonBadges({
  domain,
  level,
  minutes,
  lastVerified,
}: {
  domain?: string;
  level?: string;
  minutes?: number;
  lastVerified?: Date;
}) {
  if (!domain && !level && !minutes && !lastVerified) return null;
  const d = domain ? domainStyle(domain) : null;
  return (
    <div className="not-prose flex flex-wrap items-center gap-2 text-xs text-fd-muted-foreground">
      {d && (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${d.tile}`}>
          <d.icon className="size-3" aria-hidden /> {d.label}
        </span>
      )}
      <LevelPill level={level} />
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
    <section className="not-prose mt-10 rounded-xl border bg-fd-card p-5 text-sm">
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        <BookMarked className="size-4 text-fd-primary" aria-hidden /> Sources
      </h2>
      {lastVerified && (
        <p className="mb-4 text-fd-muted-foreground">Facts last checked against these on {fmt(lastVerified)}.</p>
      )}
      <ul className="flex flex-col gap-2">
        {sources.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span className="mt-0.5 w-16 shrink-0 rounded border bg-fd-muted px-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-fd-muted-foreground">
              {s.type}
            </span>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1 text-fd-foreground underline decoration-fd-border underline-offset-4 hover:text-fd-primary hover:decoration-fd-primary"
            >
              {s.title} <ExternalLink className="mt-1 size-3 shrink-0" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
