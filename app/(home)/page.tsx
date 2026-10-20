import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Lightbulb,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  Workflow,
  Zap,
} from 'lucide-react';
import { getAllLessons } from '@/lib/catalog';
import { DOMAIN_STYLES } from '@/components/domain-meta';
import { LessonTile } from '@/components/catalog';

const LESSON_SHAPE = [
  { icon: Zap, title: 'In 3 lines', text: 'The whole idea, fast.' },
  { icon: Lightbulb, title: 'Think of it like…', text: 'An everyday comparison.' },
  { icon: BookOpen, title: 'Real-world example', text: 'Where you would see it.' },
  { icon: Workflow, title: 'How it works', text: 'Step by step, with diagrams.' },
  { icon: TriangleAlert, title: 'Common mistakes', text: 'What trips people up.' },
  { icon: Brain, title: 'Remember + Quiz', text: 'Lock it in, then review later.' },
];

export default function HomePage() {
  const lessons = getAllLessons();
  const count = (d: string) => lessons.filter((l) => l.domain === d).length;
  const live = DOMAIN_STYLES.filter((d) => count(d.slug) > 0).length;
  const latest = [...lessons]
    .map((l, i) => ({ l, i }))
    .sort((a, b) => (b.l.lastVerified?.getTime() ?? 0) - (a.l.lastVerified?.getTime() ?? 0) || b.i - a.i)
    .slice(0, 3)
    .map(({ l }) => l);
  const firstLesson = lessons[0];

  return (
    <main className="relative w-full overflow-hidden">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)_0%,transparent_65%)] opacity-[0.12] dark:opacity-20"
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-fd-primary" aria-hidden />
            Every lesson is sourced, checked and approved before it goes live
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Learn it once.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:via-violet-300 dark:to-fuchsia-300">
              Remember it later.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-fd-muted-foreground text-pretty">
            Short lessons in plain words on AI agents, MarTech, loop and harness engineering. Each one has a
            real-world example, a quick quiz, and spaced review so it sticks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={firstLesson?.url ?? '/docs'}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Start learning <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/review"
              className="inline-flex items-center gap-2 rounded-lg border bg-fd-card px-5 py-2.5 font-medium shadow-sm transition hover:bg-fd-accent"
            >
              <RotateCcw className="size-4" aria-hidden /> Review today
            </Link>
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x rounded-xl border bg-fd-card/60 py-4 shadow-sm backdrop-blur">
            {[
              { k: 'Lessons', v: lessons.length },
              { k: 'Tracks live', v: `${live}/${DOMAIN_STYLES.length}` },
              { k: 'Min each', v: '≤ 10' },
            ].map((s) => (
              <div key={s.k} className="px-2">
                <dt className="text-xs text-fd-muted-foreground">{s.k}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Learning path */}
        <section className="mt-24">
          <SectionHeading eyebrow="Learning path" title="Five tracks, one path" text="Each track builds on the one before it. Start at step 1." />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOMAIN_STYLES.map(({ slug, label, blurb, icon: Icon, tile, bar }, i) => {
              const n = count(slug);
              return (
                <li key={slug}>
                  <Link
                    href={`/docs/${slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-fd-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} />
                    <div className="flex items-center justify-between">
                      <span className={`flex size-10 items-center justify-center rounded-xl ${tile}`}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="text-xs font-medium text-fd-muted-foreground">Step {i + 1}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold group-hover:text-fd-primary">{label}</h3>
                    <p className="mt-1 flex-1 text-sm text-fd-muted-foreground">{blurb}</p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      {n === 0 ? (
                        <span className="rounded-full bg-fd-muted px-2.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
                          Coming soon
                        </span>
                      ) : (
                        <span className="rounded-full bg-fd-primary/10 px-2.5 py-0.5 text-xs font-medium text-fd-primary">
                          {n} lesson{n > 1 ? 's' : ''}
                        </span>
                      )}
                      <ArrowRight
                        className="size-4 text-fd-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-fd-primary"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Latest lessons */}
        {latest.length > 0 && (
          <section className="mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Fresh" title="Latest lessons" align="left" />
              <Link href="/docs" className="inline-flex items-center gap-1 text-sm font-medium text-fd-primary hover:underline">
                All lessons <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {latest.map((l) => (
                <li key={l.url}>
                  <LessonTile lesson={l} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Lesson shape */}
        <section className="mt-24 rounded-2xl border bg-fd-card p-6 shadow-sm sm:p-10">
          <SectionHeading
            eyebrow="Method"
            title="Every lesson has the same shape"
            text="So you always know where to look. Read the first box if you are short on time."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LESSON_SHAPE.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-3 rounded-xl p-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">
                    <span className="mr-1 text-fd-muted-foreground">{i + 1}.</span>
                    {title}
                  </p>
                  <p className="text-sm text-fd-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-fd-muted-foreground">
            <ListChecks className="size-4" aria-hidden />
            Press <b className="text-fd-foreground">Mark as learned</b> and the review page brings it back at 1, 3, 7, 16 and 35 days.
          </p>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}>
      <p className="text-sm font-semibold uppercase tracking-wider text-fd-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {text && <p className="mt-2 text-fd-muted-foreground">{text}</p>}
    </div>
  );
}
