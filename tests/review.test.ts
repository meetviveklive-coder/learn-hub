import { describe, expect, it } from 'vitest';
import { schedule, review, dueItems, INTERVALS } from '../lib/review';

const DAY = 86400000;
const t0 = Date.UTC(2026, 0, 1);

describe('spaced review', () => {
  it('first review is due after 1 day', () => {
    const s = schedule({}, '/a', 'A', t0);
    expect(dueItems(s, t0)).toHaveLength(0);
    expect(dueItems(s, t0 + DAY)).toHaveLength(1);
  });

  it('remembered moves up the ladder, forgot restarts', () => {
    let s = schedule({}, '/a', 'A', t0);
    s = review(s, '/a', true, t0 + DAY);
    expect(s['/a'].step).toBe(1);
    expect(s['/a'].due).toBe(t0 + DAY + INTERVALS[1] * DAY);
    s = review(s, '/a', false, t0 + 5 * DAY);
    expect(s['/a'].step).toBe(0);
  });

  it('finishes after the last interval', () => {
    let s = schedule({}, '/a', 'A', t0);
    for (let i = 0; i < INTERVALS.length; i++) s = review(s, '/a', true, t0);
    expect(Number.isFinite(s['/a'].due)).toBe(false);
    expect(dueItems(s, t0 + 1000 * DAY)).toHaveLength(0);
  });
});
