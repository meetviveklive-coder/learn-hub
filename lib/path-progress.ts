// Learning-path progress, stored per browser in localStorage.
// A lesson counts as done if the reader ticked it on the path page, or pressed
// "Mark as learned" on the lesson (lib/review.ts) and has not unticked it here.

const KEY = 'learn-hub:path:ai-architect:v1';

/** url → true (ticked) or false (explicitly unticked, overrides "Mark as learned"). */
export type PathProgress = Record<string, boolean>;

export function loadProgress(): PathProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as PathProgress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: PathProgress): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function isDone(url: string, progress: PathProgress, learned: ReadonlySet<string>): boolean {
  return progress[url] ?? learned.has(url);
}

export function setDone(progress: PathProgress, url: string, done: boolean): PathProgress {
  return { ...progress, [url]: done };
}

export function summary(urls: string[], progress: PathProgress, learned: ReadonlySet<string>) {
  const done = urls.filter((u) => isDone(u, progress, learned)).length;
  const next = urls.find((u) => !isDone(u, progress, learned));
  return { done, total: urls.length, percent: urls.length ? Math.round((done / urls.length) * 100) : 0, next };
}
