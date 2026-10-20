import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span className="font-semibold">{appName}</span>,
    },
    links: [
      { text: 'Lessons', url: '/docs' },
      { text: 'Review today', url: '/review' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
