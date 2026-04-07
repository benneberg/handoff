import type { SystemCard } from '@shared/types';
export function generateCardMarkdown(card: SystemCard): string {
  return `# ${card.projectName || 'Untitled System Card'}
> ${card.oneLiner || 'No one-liner provided.'}
## Overview
- **Target User:** ${card.targetUser || 'N/A'}
- **Handoff Readiness:** ${card.handoffReadiness || 1}/10
## The Paradox
### The Human Problem
${card.problem || 'N/A'}
### The System Solution
${card.solution || 'N/A'}
## Architecture Details
### Core Workflow
${card.coreWorkflow || 'N/A'}
### Implementation Strategy
${card.differentiation || 'N/A'}
### MVP Build Order
${card.mvpBuildOrder || 'N/A'}
## Strategy
- **Monetization:** ${card.monetization || 'N/A'}
- **Next Expansion:** ${card.nextExpansion || 'N/A'}
## Analysis
### What Works
${card.whatWorks?.length ? card.whatWorks.map(w => `- ✅ ${w}`).join('\n') : 'No items listed.'}
### What Doesn't Work
${card.whatDoesntWork?.length ? card.whatDoesntWork.map(w => `- ⚠️ ${w}`).join('\n') : 'No items listed.'}
---
*Generated via Architect Paradox Dashboard*
`;
}