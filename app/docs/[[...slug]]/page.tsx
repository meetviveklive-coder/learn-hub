import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';
import { LessonBadges, OutdatedBanner, SourcesList } from '@/components/lesson/lesson-meta';
import { MarkLearned } from '@/components/lesson/mark-learned';
import { DomainOverview } from '@/components/catalog';
import { DOMAINS } from '@/lib/source';
import type { Domain } from '@/lib/catalog';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const isLesson = Boolean(page.data.domain);
  const domainIndex =
    page.slugs.length === 1 && (DOMAINS as readonly string[]).includes(page.slugs[0])
      ? (page.slugs[0] as Domain)
      : null;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-6">
        {isLesson ? (
          <LessonBadges
            domain={page.data.domain}
            level={page.data.level}
            minutes={page.data.reading_minutes}
            lastVerified={page.data.last_verified}
          />
        ) : (
          <span />
        )}
        <div className="flex flex-row items-center gap-2">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          />
        </div>
      </div>
      {page.data.status === 'needs_update' && <OutdatedBanner />}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
        {domainIndex && <DomainOverview domain={domainIndex} />}
        {isLesson && (
          <>
            <MarkLearned url={page.url} title={page.data.title} />
            <SourcesList sources={page.data.sources} lastVerified={page.data.last_verified} />
          </>
        )}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
