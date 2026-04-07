import type { SystemCard, CardTemplate, User, Chat, ChatMessage } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'System Architect' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Internal Logs' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];
export const MOCK_SYSTEM_CARDS: SystemCard[] = [
  {
    id: 'sc1',
    projectName: 'Graceful Degradation',
    oneLiner: 'Maintaining core functionality during partial failure.',
    targetUser: 'The Exhausted Overachiever',
    problem: 'Attempting to maintain 100% output while internal resources are depleted leads to total system crash (burnout).',
    solution: 'Implement a priority-based resource allocator that shuts down non-critical emotional background tasks.',
    coreWorkflow: 'Detection of low energy -> Trigger "Safe Mode" -> Execute only core survival loops.',
    mvpBuildOrder: '1. Energy monitoring, 2. Task prioritization, 3. Graceful shutdown sequence.',
    differentiation: 'Focuses on continuity over perfection.',
    monetization: 'Sustainable long-term output.',
    nextExpansion: 'Predictive maintenance based on historical stress loads.',
    whatWorks: ['Reduces immediate stress', 'Prevents total collapse'],
    whatDoesntWork: ['Social obligations', 'Deep creative focus'],
    handoffReadiness: 8,
    createdAt: Date.now()
  },
  {
    id: 'sc2',
    projectName: 'Eventual Consistency',
    oneLiner: 'Values and actions aligning over time.',
    targetUser: 'The Aspiring Idealist',
    problem: 'Deep cognitive dissonance when current actions do not match long-term identity goals.',
    solution: 'Accept asynchronous updates to personal character; focus on the convergence rather than the snapshot.',
    coreWorkflow: 'Action performed -> Log discrepancy -> Background reconciliation -> Incremental character update.',
    mvpBuildOrder: '1. Identity logging, 2. Value mapping, 3. Reconciliation rituals.',
    differentiation: 'Optimistic concurrency for human growth.',
    monetization: 'High-integrity leadership.',
    nextExpansion: 'Global value synchronization across all life domains.',
    whatWorks: ['Reduces guilt', 'Encourages long-term change'],
    whatDoesntWork: ['Instant gratification', 'Strict moral accounting'],
    handoffReadiness: 6,
    createdAt: Date.now()
  }
];
export const SYSTEM_CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'tmpl-ai-agent',
    name: 'AI Agent Framework',
    description: 'Autonomous systems designed for specific domain expertise.',
    preset: {
      projectName: 'Autonomous [Domain] Agent',
      targetUser: 'Domain experts needing scale',
      coreWorkflow: 'Ingestion -> Reasoning -> Tool Execution -> Feedback Loop',
      differentiation: 'Proprietary knowledge graph integration',
      handoffReadiness: 3
    }
  },
  {
    id: 'tmpl-saas',
    name: 'B2B SaaS Boilerplate',
    description: 'Multi-tenant platform for solving organizational friction.',
    preset: {
      projectName: 'Streamline [Industry]',
      monetization: 'Tiered subscription (Seat-based)',
      nextExpansion: 'Enterprise SSO and API marketplace',
      handoffReadiness: 4
    }
  },
  {
    id: 'tmpl-dev-tool',
    name: 'Developer Platform',
    description: 'Tools that improve the DX for specific stacks.',
    preset: {
      projectName: '[Stack] Orchestrator',
      problem: 'High configuration overhead for microservices',
      solution: 'Declarative abstraction layer for deployment',
      handoffReadiness: 5
    }
  }
];