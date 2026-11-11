import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { PATH_STAGES } from '../lib/learning-path';
import { isDone, setDone, summary } from '../lib/path-progress';

const file = (p: string) => join(process.cwd(), 'content/docs', `${p}.mdx`);
const frontmatter = (p: string) => parseYaml(readFileSync(file(p), 'utf8').match(/^---\n([\s\S]*?)\n---/)![1]);
const ordered = PATH_STAGES.flatMap((s) => s.lessons);

describe('learning path data', () => {
  it('every lesson exists', () => {
    for (const p of ordered) expect(existsSync(file(p)), p).toBe(true);
  });

  it('includes every lesson on the site', () => {
    const root = join(process.cwd(), 'content/docs');
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((f) => {
        const p = join(d, f);
        return statSync(p).isDirectory() ? walk(p) : f.endsWith('.mdx') && f !== 'index.mdx' ? [p] : [];
      });
    const onPath = new Set(ordered);
    const missing = walk(root)
      .map((f) => f.slice(root.length + 1, -'.mdx'.length))
      .filter((p) => frontmatter(p).status !== 'draft' && !onPath.has(p));
    expect(missing, 'add these to lib/learning-path.ts').toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(ordered).size).toBe(ordered.length);
  });

  it('puts prerequisites before the lessons that need them', () => {
    const position = new Map(ordered.map((p, i) => [p.split('/').pop()!, i]));
    for (const [i, p] of ordered.entries()) {
      for (const pre of frontmatter(p).prerequisites ?? []) {
        if (position.has(pre)) expect(position.get(pre)!, `${pre} must come before ${p}`).toBeLessThan(i);
      }
    }
  });
});

describe('path progress', () => {
  const learned = new Set(['/b']);

  it('counts ticked and "Mark as learned" lessons', () => {
    const p = setDone({}, '/a', true);
    expect(summary(['/a', '/b', '/c'], p, learned)).toEqual({ done: 2, total: 3, percent: 67, next: '/c' });
  });

  it('an explicit untick overrides "Mark as learned"', () => {
    expect(isDone('/b', setDone({}, '/b', false), learned)).toBe(false);
  });

  it('reports no next lesson when complete', () => {
    expect(summary(['/b'], {}, learned).next).toBeUndefined();
  });
});
