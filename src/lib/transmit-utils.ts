import type { SystemCard, TransmitVenue } from '@shared/types';
export function formatForHN(card: SystemCard): string {
  return `Show HN: ${card.projectName} – ${card.oneLiner}
I built a "System Card" for this project. It's a structured architecture for the human condition.
Problem: ${card.problem}
Solution: ${card.solution}
Core Workflow:
${card.coreWorkflow}
Readiness Score: ${card.handoffReadiness}/10
Build Order: ${card.mvpBuildOrder}
What do you think of this architectural approach to life systems?`;
}
export function formatForTwitter(card: SystemCard): string {
  const intro = `🧵 New Architecture: ${card.projectName}\n\n"${card.oneLiner}"\n\nA thread on system design for the human condition. 1/n`;
  const problem = `2/ The Problem (Human Condition):\n\n${card.problem}`;
  const solution = `3/ The Solution (System Logic):\n\n${card.solution}`;
  const workflow = `4/ Core Workflow:\n\n${card.coreWorkflow}`;
  const stats = `5/ System Stats:\n\n✅ Works: ${card.whatWorks.join(', ')}\n\nReadiness: ${card.handoffReadiness}/10`;
  return [intro, problem, solution, workflow, stats].join('\n\n---\n\n');
}
export function formatForReddit(card: SystemCard): string {
  return `# [Project] ${card.projectName}
> ${card.oneLiner}
## TL;DR
Applying ${card.projectName} to the human condition of "${card.targetUser}".
## The Architecture
**The Problem:** ${card.problem}
**The System Solution:** ${card.solution}
## Implementation
**Workflow:**
${card.coreWorkflow}
**Build Order:**
${card.mvpBuildOrder}
## Strategy
**Differentiation:** ${card.differentiation}
**Sustainability:** ${card.monetization}
---
*Readiness: ${card.handoffReadiness}/10*`;
}
export function formatForGeneric(card: SystemCard): string {
  return `SYSTEM CARD: ${card.projectName}
"${card.oneLiner}"
Target: ${card.targetUser}
Problem: ${card.problem}
Solution: ${card.solution}
Workflow: ${card.coreWorkflow}
Readiness: ${card.handoffReadiness}/10`;
}
export function transmit(card: SystemCard, venue: TransmitVenue): string {
  switch (venue) {
    case 'hn': return formatForHN(card);
    case 'twitter': return formatForTwitter(card);
    case 'reddit': return formatForReddit(card);
    case 'generic': return formatForGeneric(card);
    default: return formatForGeneric(card);
  }
}