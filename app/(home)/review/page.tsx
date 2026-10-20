import type { Metadata } from 'next';
import { ReviewList } from '@/components/review-list';

export const metadata: Metadata = {
  title: 'Review today',
  description: 'Lessons due for review so you remember them.',
};

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Review today</h1>
      <p className="mt-2 mb-8 text-fd-muted-foreground">
        Reading once is not enough. Short reviews at growing gaps move a lesson into long-term memory.
      </p>
      <ReviewList />
    </div>
  );
}
