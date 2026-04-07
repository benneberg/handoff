import type { SystemCard } from '@shared/types';
export function generateCardMarkdown(card: SystemCard): string {
  return `# ${card.projectName || 'Untitled System Card'}
> ${card.oneLiner || 'No description provided.'}
## Overview
- **Target User:** ${card.targetUser || 'Unspecified'}
- **Readiness Score:** ${card.handoffReadiness || 1}/10
- **Created At:** ${card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'N/A'}
## The Architecture
### The Human Problem
${card.problem || 'N/A'}
### The System Solution
${card.solution || 'N/A'}
## Implementation Logic
### Core Workflow
${card.coreWorkflow || 'N/A'}
### MVP Build Order
${card.mvpBuildOrder || 'N/A'}
## Strategic Context
### Differentiation
${card.differentiation || 'N/A'}
### Value Capture & Monetization
${card.monetization || 'N/A'}
### Next Expansion Path
${card.nextExpansion || 'N/A'}
## Analysis
### Strengths (What Works)
${card.whatWorks?.length ? card.whatWorks.map(w => `- ✅ ${w}`).join('\n') : 'No strengths listed.'}
### Limitations (What Doesn't Work)
${card.whatDoesntWork?.length ? card.whatDoesntWork.map(w => `- ⚠️ ${w}`).join('\n') : 'No limitations listed.'}
---
*Generated via Architect Paradox Dashboard*
`;
}