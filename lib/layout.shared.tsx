import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GraduationCap } from 'lucide-react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <GraduationCap className="size-4" aria-hidden />
          </span>
          {appName}
        </span>
      ),
    },
    links: [
      { text: 'Lessons', url: '/docs' },
      { text: 'Review today', url: '/review' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
