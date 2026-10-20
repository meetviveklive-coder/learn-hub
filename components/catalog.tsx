import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { getDomainTopics, getQueued, type Domain, type LessonCard } from '@/lib/catalog';
import { domainStyle, LevelPill } from '@/components/domain-meta';

/** One lesson as a card: used on the home page and in domain overviews. */
export function LessonTile({ lesson, index }: { lesson: LessonCard; index?: number }) {
  const d = domainStyle(lesson.domain);
  return (
    <Link
      href={lesson.url}
      className="group flex h-full gap-4 rounded-xl border bg-fd-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-fd-primary/40 hover:shadow-md"
    >
      {index !== undefined && (
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${d.tile}`}
          aria-hidden
        >
          {index + 1}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-semibold leading-snug text-fd-foreground group-hover:text-fd-primary">{lesson.title}</p>
        {lesson.description && (
          <p className="mt-1 line-clamp-2 text-sm text-fd-muted-foreground">{lesson.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-xs text-fd-muted-foreground">
          <LevelPill level={lesson.level} />
          {lesson.minutes && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden /> {lesson.minutes} min
            </span>
          )}
        </div>
      </div>
      <ArrowRight
        className="mt-1 size-4 shrink-0 text-fd-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-fd-primary"
        aria-hidden
      />
    </Link>
  );
}

/** Rendered under a domain's index page: topics, their lessons, and what is queued next. */
export function DomainOverview({ domain }: { domain: Domain }) {
  const topics = getDomainTopics(domain).filter((t) => t.lessons.length > 0);
  const queued = getQueued(domain);
  const total = topics.reduce((n, t) => n + t.lessons.length, 0);
  const minutes = topics.reduce((n, t) => n + t.lessons.reduce((m, l) => m + (l.minutes ?? 0), 0), 0);
  const first = topics[0]?.lessons[0];

  return (
    <div className="not-prose mt-2 flex flex-col gap-10">
      {total > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-fd-card p-4">
          <p className="text-sm text-fd-muted-foreground">
            <b className="text-fd-foreground">{total}</b> lesson{total > 1 ? 's' : ''} ·{' '}
            <b className="text-fd-foreground">{minutes}</b> min total · read them in order
          </p>
          {first && (
            <Link
              href={first.url}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground shadow-sm hover:opacity-90"
            >
              Start with lesson 1 <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-sm text-fd-muted-foreground">
          No lessons here yet. They are written in the order set in the learning queue.
        </div>
      )}

      {topics.map((t) => (
        <section key={t.slug}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fd-muted-foreground">{t.title}</h2>
          <ol className="grid gap-3">
            {t.lessons.map((l, i) => (
              <li key={l.url}>
                <LessonTile lesson={l} index={i} />
              </li>
            ))}
          </ol>
        </section>
      ))}

      {queued.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fd-muted-foreground">
            <Sparkles className="size-4" aria-hidden /> Coming next
          </h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {queued.map((q) => (
              <li key={q.id} className="rounded-xl border border-dashed p-4 text-sm">
                <p className="font-medium">{q.title}</p>
                <p className="mt-1 text-xs text-fd-muted-foreground">
                  {q.status === 'in_review' ? 'Written, in review' : 'Queued'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
