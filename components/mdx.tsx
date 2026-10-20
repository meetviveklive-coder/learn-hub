import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Quiz } from '@/components/lesson/quiz';
import { Analogy, Remember } from '@/components/lesson/callouts';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Quiz,
    Analogy,
    Remember,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
