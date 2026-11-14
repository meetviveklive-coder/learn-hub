// The "Become an AI Technical Architect" path: an ordered, cross-track reading list.
// Plain data (no Fumadocs imports) so unit tests can check it against content/docs.
// Each entry is a lesson path under /docs, e.g. 'ai-agents/foundations/what-is-an-ai-agent'.
// Rule (enforced by tests/learning-path.test.ts): a lesson's prerequisites that are on the path
// must appear earlier on the path, and every published lesson must be on the path.
// Agents add each new lesson here (AGENTS.md §5) — the only site file they may edit.

export type PathStage = {
  id: string;
  title: string;
  goal: string;
  lessons: string[];
};

export const PATH_STAGES: PathStage[] = [
  {
    id: 'agent-basics',
    title: 'How AI agents work',
    goal: 'The building blocks every later design decision uses, and how to tell if an agent did well.',
    lessons: [
      'ai-agents/foundations/what-is-an-ai-agent',
      'ai-agents/foundations/the-agent-loop',
      'ai-agents/foundations/tools-and-function-calling',
      'ai-agents/foundations/context-window-and-memory',
      'ai-agents/foundations/prompt-vs-context-engineering',
      'ai-agents/tools/mcp-basics',
      'ai-agents/patterns/subagents-maker-checker',
      'ai-agents/patterns/evaluating-agents',
    ],
  },
  {
    id: 'role',
    title: 'The architect role and the big picture',
    goal: 'What the job is, and the one-page map of an enterprise AI system.',
    lessons: [
      'ai-architect/foundations/what-does-an-ai-architect-do',
      'ai-architect/foundations/enterprise-ai-reference-architecture',
    ],
  },
  {
    id: 'decisions',
    title: 'First big decisions',
    goal: 'How to choose an approach and a model, including fast classifier models like Jev, before building anything.',
    lessons: [
      'ai-architect/foundations/build-buy-or-customize',
      'ai-architect/foundations/choosing-a-model',
      'jev/foundations/what-is-jev',
      'jev/foundations/discriminative-vs-generative',
      'jev/patterns/jev-in-an-agent-loop',
      'ai-architect/foundations/fine-tuning-when-and-how',
    ],
  },
  {
    id: 'martech',
    title: 'Customer data and privacy (MarTech)',
    goal: 'A real domain to practise on: customer data, tracking and consent. The data stage builds on it.',
    lessons: [
      'martech/foundations/what-is-martech-stack',
      'martech/data/first-party-data-and-identity',
      'martech/data/what-is-a-cdp',
      'martech/analytics/event-tracking-basics',
      'martech/analytics/tag-management-basics',
      'martech/privacy/consent-and-privacy-basics',
    ],
  },
  {
    id: 'data',
    title: 'Data and knowledge',
    goal: 'Getting company data ready and giving AI access to it safely.',
    lessons: [
      'ai-architect/building-blocks/rag-architecture',
      'ai-architect/data/data-readiness-for-ai',
      'ai-architect/building-blocks/document-and-multimodal-ai',
      'ai-architect/data/vector-databases-and-embeddings',
      'ai-architect/data/privacy-and-data-residency',
      'ai-architect/security-governance/permission-aware-retrieval',
    ],
  },
  {
    id: 'agents-at-work',
    title: 'Agents and harnesses in practice',
    goal: 'Patterns for combining model calls, and the harness that keeps agents safe.',
    lessons: [
      'ai-architect/building-blocks/agent-workflow-patterns',
      'harness-engineering/foundations/what-is-harness-engineering',
      'harness-engineering/building-blocks/instruction-files',
      'harness-engineering/building-blocks/guardrails-and-hooks',
      'loop-engineering/foundations/what-is-loop-engineering',
      'loop-engineering/foundations/anatomy-of-a-loop',
      'loop-engineering/tools/loops-in-claude-code',
      'loop-engineering/patterns/when-not-to-loop',
    ],
  },
  {
    id: 'integration',
    title: 'Connecting AI to company systems',
    goal: 'The platform pieces between models and the rest of the business.',
    lessons: [
      'ai-architect/building-blocks/ai-gateway',
      'ai-architect/building-blocks/integration-patterns',
      'ai-architect/building-blocks/structured-outputs-and-validation',
      'ai-architect/building-blocks/agents-in-the-enterprise',
      'ai-architect/building-blocks/multi-tenant-ai-architecture',
      'ai-architect/building-blocks/agent-state-and-memory-architecture',
    ],
  },
  {
    id: 'security',
    title: 'Security, safety and governance',
    goal: 'Designing against AI-specific attacks and meeting the rules.',
    lessons: [
      'ai-architect/security-governance/ai-security-threats',
      'ai-architect/security-governance/guardrails-architecture',
      'ai-architect/building-blocks/human-in-the-loop-design',
      'ai-architect/security-governance/ai-red-teaming',
      'ai-architect/security-governance/ai-governance-frameworks',
      'ai-architect/security-governance/responsible-ai-in-practice',
    ],
  },
  {
    id: 'operations',
    title: 'Quality and operations',
    goal: 'Measuring, monitoring and running AI in production.',
    lessons: [
      'ai-architect/operations/evaluating-rag-systems',
      'ai-architect/operations/llmops-and-observability',
      'ai-architect/operations/ai-cost-and-finops',
      'ai-architect/operations/latency-scaling-and-reliability',
      'ai-architect/operations/shipping-ai-changes-safely',
      'ai-architect/operations/ai-incident-response',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery and the capstone',
    goal: 'Where AI runs, how decisions are recorded, and one system designed end to end.',
    lessons: [
      'ai-architect/delivery/deployment-options',
      'ai-architect/security-governance/ai-vendor-risk-assessment',
      'ai-architect/delivery/ai-architecture-decision-records',
      'ai-architect/delivery/from-pilot-to-production',
      'ai-architect/delivery/capstone-ai-system-design',
    ],
  },
];

/** Stage that collects AI Architect lessons published after this list was last edited. */
export const NEW_LESSONS_STAGE = {
  id: 'new',
  title: 'New on the AI Architect track',
  goal: 'Lessons added since this path was last arranged. Read them after the stage they build on.',
};

export const pathUrl = (p: string) => `/docs/${p}`;
