'use client';

import { useId, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/cn';

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

function Question({
  item,
  index,
  onResult,
}: {
  item: QuizQuestion;
  index: number;
  onResult: (correct: boolean | null) => void;
}) {
  const name = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked === item.answer;

  return (
    <fieldset className="not-prose rounded-xl border bg-fd-card p-5 shadow-sm">
      <legend className="sr-only">Question {index + 1}</legend>
      <p className="mb-4 flex gap-3 font-medium text-fd-foreground">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-fd-primary/10 text-xs font-semibold text-fd-primary">
          {index + 1}
        </span>
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
            onClick={() => {
              setChecked(true);
              onResult(picked === item.answer);
            }}
            className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setChecked(false);
              onResult(null);
            }}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-fd-accent"
          >
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
        )}
      </div>

      {checked && (
        <div
          role="status"
          className={cn(
            'mt-3 rounded-lg border-l-4 p-3 text-sm',
            correct ? 'border-l-green-600 bg-green-600/[0.07]' : 'border-l-red-600 bg-red-600/[0.07]',
          )}
        >
          <p className="font-semibold">{correct ? '✓ Right.' : '✗ Not quite.'}</p>
          <p className="mt-1 text-fd-muted-foreground">{item.why}</p>
        </div>
      )}
    </fieldset>
  );
}

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [results, setResults] = useState<(boolean | null)[]>(() => questions.map(() => null));
  const answered = results.filter((r) => r !== null).length;
  const right = results.filter((r) => r === true).length;
  const done = answered === questions.length;

  return (
    <div className="my-6 flex flex-col gap-4">
      <div className="not-prose flex items-center justify-between gap-3 rounded-xl border bg-fd-muted/50 px-4 py-3 text-sm">
        <span className="text-fd-muted-foreground">
          {done ? 'Quiz finished' : 'Answer without scrolling up'}
        </span>
        <span className="inline-flex items-center gap-2 font-medium tabular-nums" aria-live="polite">
          {done && <Trophy className="size-4 text-amber-500" aria-hidden />}
          {right} / {questions.length} correct
        </span>
      </div>
      <div className="not-prose h-1.5 overflow-hidden rounded-full bg-fd-muted" aria-hidden>
        <div
          className="h-full rounded-full bg-fd-primary transition-all"
          style={{ width: `${(answered / questions.length) * 100}%` }}
        />
      </div>
      {questions.map((item, i) => (
        <Question
          key={i}
          item={item}
          index={i}
          onResult={(r) => setResults((prev) => prev.map((v, j) => (j === i ? r : v)))}
        />
      ))}
    </div>
  );
}
