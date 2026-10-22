import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Learn Hub';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// TODO(owner): set to your GitHub username and repo once created.
export const gitConfig = {
  user: 'meetviveklive-coder',
  repo: 'learn-hub',
  branch: 'main',
};

export const DOMAIN_LABELS: Record<string, string> = {
  'ai-agents': 'AI Agents',
  martech: 'MarTech',
  jev: 'Jev (AI model)',
  'loop-engineering': 'Loop Engineering',
  'harness-engineering': 'Harness Engineering',
  'ai-architect': 'Path to AI Technical Architect',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
