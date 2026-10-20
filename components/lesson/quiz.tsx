'use client';

import { useId, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

function Question({ item, index }: { item: QuizQuestion; index: number }) {
  const name = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked === item.answer;

  return (
    <fieldset className="not-prose rounded-xl border bg-fd-card p-4">
      <legend className="sr-only">Question {index + 1}</legend>
      <p className="mb-3 font-medium text-fd-foreground">
        <span className="mr-2 text-fd-muted-foreground">Q{index + 1}.</span>
        {item.q}
      </p>
      <div className="flex flex-col gap-2">
        {item.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === item.answer;
          return (
            <label
              key={i}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fd-primary',
                !checked && isPicked && 'border-fd-primary bg-fd-primary/10',
                !checked && !isPicked && 'hover:bg-fd-accent',
                checked && isAnswer && 'border-green-600 bg-green-600/10',
                checked && isPicked && !isAnswer && 'border-red-600 bg-red-600/10',
                checked && 'cursor-default',
              )}
            >
              <input
                type="radio"
                name={name}
                className="accent-fd-primary"
                checked={isPicked}
                disabled={checked}
                onChange={() => setPicked(i)}
              />
              <span className="flex-1">{opt}</span>
              {checked && isAnswer && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
                  <CheckCircle2 className="size-4" aria-hidden /> Correct answer
                </span>
              )}
              {checked && isPicked && !isAnswer && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
                  <XCircle className="size-4" aria-hidden /> Your pick
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {!checked ? (
          <button
            type="button"
            disabled={picked === null}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setChecked(false);
            }}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-fd-accent"
          >
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
        )}
      </div>

      {checked && (
        <div role="status" className="mt-3 rounded-lg bg-fd-muted p-3 text-sm">
          <p className="font-semibold">{correct ? '✓ Right.' : '✗ Not quite.'}</p>
          <p className="mt-1 text-fd-muted-foreground">{item.why}</p>
        </div>
      )}
    </fieldset>
  );
}

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="my-6 flex flex-col gap-4">
      {questions.map((item, i) => (
        <Question key={i} item={item} index={i} />
      ))}
    </div>
  );
}
