import type { SystemCard, TransmitVenue } from '@shared/types';
export function formatForHN(card: SystemCard): string {
  return `Show HN: ${card.projectName} – ${card.oneLiner}
I've been working on a "System Card" methodology for personal and technical architecture. This card represents a framework for handling specific human conditions through system design principles.
Problem: ${card.problem}
Solution: ${card.solution}
Core Logic Flow:
${card.coreWorkflow}
Implementation Readiness: ${card.handoffReadiness}/10
Build Order Strategy: ${card.mvpBuildOrder}
Would love to hear how other architects handle these kinds of "human-in-the-loop" system failures.`;
}
export function formatForTwitter(card: SystemCard): string {
  const truncate = (str: string, max: number) => str.length > max ? str.substring(0, max - 3) + '...' : str;
  const intro = `🧵 New System Architecture: ${card.projectName}\n\n"${truncate(card.oneLiner, 180)}"\n\nApplying system design to the human condition. 1/n`;
  const problem = `2/ The Problem:\n\n${truncate(card.problem, 240)}`;
  const solution = `3/ The Solution:\n\n${truncate(card.solution, 240)}`;
  const workflow = `4/ Logic Workflow:\n\n${truncate(card.coreWorkflow, 240)}`;
  const footer = `5/ System Stats:\n\n✅ Works: ${card.whatWorks.slice(0, 3).join(', ')}\n\nReadiness: ${card.handoffReadiness}/10 #SystemDesign #Philosophy`;
  return [intro, problem, solution, workflow, footer].join('\n\n---\n\n');
}
export function formatForReddit(card: SystemCard): string {
  return `# [System Card] ${card.projectName}
> ${card.oneLiner}
## Abstract
Applying ${card.projectName} principles to solve the "${card.targetUser}" bottleneck.
## Architecture
**The Problem:** ${card.problem}
**The Solution:** ${card.solution}
## Technical Implementation
**Workflow Pattern:**
\`\`\`
${card.coreWorkflow}
\`\`\`
**Build Order:**
${card.mvpBuildOrder}
## Strategy
**Differentiation:** ${card.differentiation}
**Monetization/Value:** ${card.monetization}
---
*Generated via Architect Paradox Dashboard | Readiness: ${card.handoffReadiness}/10*`;
}
export function formatForGeneric(card: SystemCard): string {
  const version = new Date(card.updatedAt).toISOString().split('T')[0].replace(/-/g, '.');
  return `SYSTEM CARD [v${version}]
---------------------------
PROJECT: ${card.projectName}
TAGLINE: "${card.oneLiner}"
TARGET: ${card.targetUser}
PROBLEM: ${card.problem}
SOLUTION: ${card.solution}
WORKFLOW: ${card.coreWorkflow}
READINESS: ${card.handoffReadiness}/10
BUILD ORDER: ${card.mvpBuildOrder}
DIFFERENTIATION: ${card.differentiation}
(C) ARCHITECT PARADOX`;
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