import type { Metadata } from 'next';
import { Route } from 'lucide-react';
import { getLearningPath } from '@/lib/catalog';
import { LearningPath, type PathStageView } from '@/components/learning-path';

export const metadata: Metadata = {
  title: 'Learning path: AI Technical Architect',
  description: 'Every lesson you need to become an AI technical architect, in reading order, with your progress saved.',
};

export default function PathPage() {
  const stages: PathStageView[] = getLearningPath().map((s) => ({
    id: s.id,
    title: s.title,
    goal: s.goal,
    lessons: s.lessons.map((l) => ({
      url: l.url,
      title: l.title,
      description: l.description,
      domain: l.domain,
      level: l.level,
      minutes: l.minutes,
    })),
  }));
  const count = stages.reduce((n, s) => n + s.lessons.length, 0);
  const minutes = stages.reduce((n, s) => n + s.lessons.reduce((m, l) => m + (l.minutes ?? 0), 0), 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <span className="flex size-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300">
        <Route className="size-5" aria-hidden />
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Become an AI Technical Architect</h1>
      <p className="mt-2 max-w-2xl text-fd-muted-foreground">
        One reading order across every track: agent basics first, then the architect role, customer data, AI data, security, operations and a
        capstone. {count} lessons, about {Math.round(minutes / 60)} hours in total.
      </p>
      <p className="mt-2 mb-10 max-w-2xl text-sm text-fd-muted-foreground">
        Tick a lesson when you finish it. Lessons you pressed <b>Mark as learned</b> on count too. Progress is saved
        in this browser only, so another device or a private window starts empty.
      </p>
      <LearningPath stages={stages} />
    </div>
  );
}
