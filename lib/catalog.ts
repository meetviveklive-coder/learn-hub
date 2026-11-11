import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Folder, Node } from 'fumadocs-core/page-tree';
import { source, DOMAINS } from './source';
import { PATH_STAGES, NEW_LESSONS_STAGE, pathUrl } from './learning-path';

export type Domain = (typeof DOMAINS)[number];

export type LessonCard = {
  url: string;
  title: string;
  description?: string;
  domain: Domain;
  topic: string;
  level?: string;
  minutes?: number;
  lastVerified?: Date;
};

export type TopicGroup = { slug: string; title: string; lessons: LessonCard[] };

type QueueItem = { id: string; domain: string; topic: string; title: string; status: string; priority?: number };

function toCard(url: string): LessonCard | null {
  const page = source.getPages().find((p) => p.url === url);
  if (!page?.data.domain || page.data.status === 'draft') return null;
  return {
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    domain: page.data.domain,
    topic: page.slugs[1] ?? '',
    level: page.data.level,
    minutes: page.data.reading_minutes,
    lastVerified: page.data.last_verified,
  };
}

const isFolder = (n: Node): n is Folder => n.type === 'folder';

/** Topics of one domain, in sidebar (meta.json) order, each with its lessons. */
export function getDomainTopics(domain: Domain): TopicGroup[] {
  const folder = source
    .getPageTree()
    .children.filter(isFolder)
    .find((f) => f.index?.url === `/docs/${domain}`);
  if (!folder) return [];

  return folder.children.filter(isFolder).map((t) => {
    const lessons = t.children
      .flatMap((n) => (n.type === 'page' ? [toCard(n.url)] : []))
      .filter((l): l is LessonCard => l !== null);
    const slug = lessons[0]?.topic ?? String(t.name).toLowerCase().replace(/\s+/g, '-');
    return { slug, title: String(t.name), lessons };
  });
}

/** All published lessons, in learning-path order (domain, then sidebar order). */
export function getAllLessons(): LessonCard[] {
  return DOMAINS.flatMap((d) => getDomainTopics(d).flatMap((t) => t.lessons));
}

/** Queued items from topics.yaml, read at build time. Empty if the file is missing or invalid. */
export function getQueued(domain: Domain, limit = 3): QueueItem[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'topics.yaml'), 'utf8');
    const items = (parseYaml(raw)?.items ?? []) as QueueItem[];
    // Skip items whose lesson is already live (status in topics.yaml can lag one run behind).
    const live = new Set(getAllLessons().map((l) => l.url.split('/').pop()));
    return items
      .filter((i) => i.domain === domain && (i.status === 'queued' || i.status === 'in_review'))
      .filter((i) => !live.has(i.id))
      .sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export type ResolvedStage = { id: string; title: string; goal: string; lessons: LessonCard[] };

/**
 * The AI Architect learning path with lesson data filled in.
 * Throws on an unknown lesson so a typo fails the build instead of silently dropping a step.
 * AI Architect lessons missing from the list are appended in a "new" stage.
 */
export function getLearningPath(): ResolvedStage[] {
  const all = getAllLessons();
  const byUrl = new Map(all.map((l) => [l.url, l]));
  const stages = PATH_STAGES.map((s) => ({
    id: s.id,
    title: s.title,
    goal: s.goal,
    lessons: s.lessons.map((p) => {
      const lesson = byUrl.get(pathUrl(p));
      if (!lesson) throw new Error(`learning path: unknown lesson "${p}" in stage "${s.id}"`);
      return lesson;
    }),
  }));
  const listed = new Set(PATH_STAGES.flatMap((s) => s.lessons.map(pathUrl)));
  const extra = all.filter((l) => l.domain === 'ai-architect' && !listed.has(l.url));
  return extra.length ? [...stages, { ...NEW_LESSONS_STAGE, lessons: extra }] : stages;
}
