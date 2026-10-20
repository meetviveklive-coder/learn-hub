import Link from 'next/link';
import { Bot, Megaphone, Gauge, Repeat, Wrench, ArrowRight } from 'lucide-react';
import { getLessons } from '@/lib/source';
import { DOMAIN_LABELS } from '@/lib/shared';

const DOMAINS = [
  { slug: 'ai-agents', icon: Bot, blurb: 'What agents are, how they loop, use tools, and remember.' },
  { slug: 'martech', icon: Megaphone, blurb: 'The marketing technology stack: data, tracking, CDPs, privacy.' },
  { slug: 'jev', icon: Gauge, blurb: 'A fast model that answers multiple-choice questions with probabilities.' },
  { slug: 'loop-engineering', icon: Repeat, blurb: 'Designing systems that prompt agents for you, on repeat.' },
  { slug: 'harness-engineering', icon: Wrench, blurb: 'The instructions, tools and guardrails around one agent run.' },
];

export default function HomePage() {
  const lessons = getLessons();
  const count = (d: string) => lessons.filter((l) => l.domain === d).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <section className="max-w-2xl">
        <p className="text-sm font-medium text-fd-primary">Learn Hub</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Learn it once. Remember it later.</h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          Short lessons in plain words, each with a real-world example and a quick quiz. Researched by AI agents,
          checked, then approved by me before they go live.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/docs" className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
            Start learning <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/review" className="rounded-lg border px-4 py-2 font-medium hover:bg-fd-accent">
            Review today
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">Learning path</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map(({ slug, icon: Icon, blurb }, i) => {
            const n = count(slug);
            return (
              <li key={slug}>
                <Link href={`/docs/${slug}`} className="flex h-full flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent">
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-fd-primary" aria-hidden />
                    <span className="text-xs text-fd-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{DOMAIN_LABELS[slug]}</h3>
                  <p className="mt-1 flex-1 text-sm text-fd-muted-foreground">{blurb}</p>
                  <p className="mt-4 text-xs font-medium">{n === 0 ? 'Coming soon' : `${n} lesson${n > 1 ? 's' : ''}`}</p>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-16 rounded-xl border p-6">
        <h2 className="font-semibold">How every lesson works</h2>
        <ol className="mt-3 grid list-inside list-decimal gap-2 text-sm text-fd-muted-foreground sm:grid-cols-2">
          <li><b className="text-fd-foreground">In 3 lines</b> — the whole idea, fast.</li>
          <li><b className="text-fd-foreground">Think of it like…</b> — an everyday comparison.</li>
          <li><b className="text-fd-foreground">Real-world example</b> — where you'd see it.</li>
          <li><b className="text-fd-foreground">How it works</b> — step by step.</li>
          <li><b className="text-fd-foreground">Common mistakes</b> — what trips people up.</li>
          <li><b className="text-fd-foreground">Remember this</b> + <b className="text-fd-foreground">Quiz</b> — lock it in.</li>
        </ol>
      </section>
    </div>
  );
}
