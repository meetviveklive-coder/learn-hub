import type { Metadata } from 'next';
import { RotateCcw } from 'lucide-react';
import { ReviewList } from '@/components/review-list';

export const metadata: Metadata = {
  title: 'Review today',
  description: 'Lessons due for review so you remember them.',
};

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <span className="flex size-11 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
        <RotateCcw className="size-5" aria-hidden />
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Review today</h1>
      <p className="mt-2 mb-10 max-w-2xl text-fd-muted-foreground">
        Reading once is not enough. Short reviews at growing gaps move a lesson into long-term memory.
      </p>
      <ReviewList />
    </div>
  );
}
