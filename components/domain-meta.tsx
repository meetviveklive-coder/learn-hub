import { Bot, Megaphone, Gauge, Repeat, Wrench, Network, type LucideIcon } from 'lucide-react';
import type { Domain } from '@/lib/catalog';
import { DOMAIN_LABELS } from '@/lib/shared';

type DomainStyle = {
  slug: Domain;
  label: string;
  blurb: string;
  icon: LucideIcon;
  /** Icon tile: background + text colour. Full class strings so Tailwind can see them. */
  tile: string;
  /** Thin top accent bar on cards. */
  bar: string;
  /** Small text accent. */
  text: string;
};

export const DOMAIN_STYLES: DomainStyle[] = [
  {
    slug: 'ai-agents',
    label: DOMAIN_LABELS['ai-agents'],
    blurb: 'What agents are, how they loop, use tools, and remember.',
    icon: Bot,
    tile: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    bar: 'from-indigo-500 to-violet-500',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    slug: 'martech',
    label: DOMAIN_LABELS.martech,
    blurb: 'The marketing technology stack: data, tracking, CDPs, privacy.',
    icon: Megaphone,
    tile: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    bar: 'from-rose-500 to-orange-400',
    text: 'text-rose-700 dark:text-rose-300',
  },
  {
    slug: 'jev',
    label: DOMAIN_LABELS.jev,
    blurb: 'A fast model that answers multiple-choice questions with probabilities.',
    icon: Gauge,
    tile: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    bar: 'from-amber-500 to-yellow-400',
    text: 'text-amber-800 dark:text-amber-300',
  },
  {
    slug: 'loop-engineering',
    label: DOMAIN_LABELS['loop-engineering'],
    blurb: 'Designing systems that prompt agents for you, on repeat.',
    icon: Repeat,
    tile: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    bar: 'from-emerald-500 to-teal-400',
    text: 'text-emerald-800 dark:text-emerald-300',
  },
  {
    slug: 'harness-engineering',
    label: DOMAIN_LABELS['harness-engineering'],
    blurb: 'The instructions, tools and guardrails around one agent run.',
    icon: Wrench,
    tile: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    bar: 'from-sky-500 to-cyan-400',
    text: 'text-sky-800 dark:text-sky-300',
  },
  {
    slug: 'ai-architect',
    label: DOMAIN_LABELS['ai-architect'],
    blurb: 'Designing and running AI systems for a whole company: layers, data, security, cost and governance.',
    icon: Network,
    tile: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
    bar: 'from-fuchsia-500 to-pink-400',
    text: 'text-fuchsia-800 dark:text-fuchsia-300',
  },
];

export function domainStyle(slug: string) {
  return DOMAIN_STYLES.find((d) => d.slug === slug) ?? DOMAIN_STYLES[0];
}

const LEVEL_CLASSES: Record<string, string> = {
  basics: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
  intermediate: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  advanced: 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300',
};

export function LevelPill({ level }: { level?: string }) {
  if (!level) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_CLASSES[level] ?? 'border-fd-border'}`}
    >
      {level}
    </span>
  );
}
