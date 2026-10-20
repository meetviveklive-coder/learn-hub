import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './global.css';

export const metadata: Metadata = {
  title: { default: 'Learn Hub', template: '%s · Learn Hub' },
  description: 'Short, simple lessons on AI agents, MarTech, Loop and Harness Engineering — with quizzes and spaced review.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
