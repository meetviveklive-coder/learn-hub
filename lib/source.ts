import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const DOMAINS = [
  'ai-agents',
  'martech',
  'jev',
  'loop-engineering',
  'harness-engineering',
  'ai-architect',
] as const;

const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().startsWith('https://'),
  type: z.enum(['official', 'paper', 'article', 'video']),
});

// Lesson fields are optional here so domain/topic index pages stay simple.
// scripts/check-lesson.mjs enforces them on every lesson file.
const lessonSchema = pageSchema.extend({
  domain: z.enum(DOMAINS).optional(),
  level: z.enum(['basics', 'intermediate', 'advanced']).optional(),
  order: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).default([]),
  last_verified: z.coerce.date().optional(),
  status: z.enum(['draft', 'published', 'needs_update']).optional(),
  author: z.enum(['agent', 'owner', 'agent+owner']).optional(),
  reading_minutes: z.number().int().positive().optional(),
});

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: lessonSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

/** All lesson pages (pages that have a `domain` in frontmatter). */
export function getLessons() {
  return source
    .getPages()
    .filter((p) => p.data.domain && p.data.status !== 'draft')
    .map((p) => ({
      url: p.url,
      title: p.data.title,
      domain: p.data.domain!,
      level: p.data.level,
      reading_minutes: p.data.reading_minutes,
    }));
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
