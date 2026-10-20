// Spaced repetition schedule stored per-browser in localStorage.
// Intervals (days) after marking a lesson learned: 1, 3, 7, 16, 35.

export const INTERVALS = [1, 3, 7, 16, 35] as const;
const KEY = 'learn-hub:reviews:v1';
const DAY = 24 * 60 * 60 * 1000;

export type ReviewItem = {
  url: string;
  title: string;
  step: number; // index into INTERVALS for the NEXT review; INTERVALS.length = finished
  due: number; // epoch ms
};

export type ReviewState = Record<string, ReviewItem>;

export function load(): ReviewState {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReviewState) : {};
  } catch {
    return {};
  }
}

export function save(state: ReviewState): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** First time a lesson is marked learned. */
export function schedule(state: ReviewState, url: string, title: string, now = Date.now()): ReviewState {
  return { ...state, [url]: { url, title, step: 0, due: now + INTERVALS[0] * DAY } };
}

/** User reviewed a due lesson. remembered=false restarts the ladder. */
export function review(state: ReviewState, url: string, remembered: boolean, now = Date.now()): ReviewState {
  const item = state[url];
  if (!item) return state;
  const step = remembered ? item.step + 1 : 0;
  const done = step >= INTERVALS.length;
  return {
    ...state,
    [url]: { ...item, step, due: done ? Number.POSITIVE_INFINITY : now + INTERVALS[step] * DAY },
  };
}

export function dueItems(state: ReviewState, now = Date.now()): ReviewItem[] {
  return Object.values(state)
    .filter((i) => i.due <= now)
    .sort((a, b) => a.due - b.due);
}

export function upcoming(state: ReviewState, now = Date.now()): ReviewItem[] {
  return Object.values(state)
    .filter((i) => i.due > now && Number.isFinite(i.due))
    .sort((a, b) => a.due - b.due);
}

export function daysUntil(due: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((due - now) / DAY));
}
