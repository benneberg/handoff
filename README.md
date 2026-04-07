# Architect Paradox – System Design for the Human Condition
**SYSCARDS** – A professional PWA dashboard designed for creating, managing, and exploring "Architect Paradox" cards—technical system design patterns applied to human struggles and personal growth.
## Overview
The Architect Paradox is a philosophical framework that translates complex software engineering principles (like Load Balancing, Graceful Degradation, or Eventual Consistency) into actionable strategies for the human condition. This application provides a high-fidelity interface to document these "life architectures."
## Key Features
- **Dashboard**: A minimalist command center to list, search, and manage your system cards. Features an elegant "Cards 0" empty state and quick template access.
- **Advanced Editor**: A robust drafting environment with full architectural fields:
  - Identity: Project Name, One-Liner, Target User.
  - Logic: Problem, Solution, Core Workflow.
  - Strategy: MVP Build Order, Differentiation, Monetization, Next Expansion.
  - Validation: Readiness Slider (1-10), What Works (✓), and System Failures (✗).
  - History: Integrated Undo/Redo state management with keyboard shortcuts (`Cmd+Z` / `Cmd+Shift+Z`).
- **Templates**: Instant starters for common patterns like AI Agent Frameworks, B2B SaaS, and Developer Tools.
- **Transmit Engine**: A specialized formatter that optimizes your system cards for social sharing on Hacker News, X (Twitter Threads), and Reddit.
- **Zen Deck**: An immersive, fullscreen viewer designed for focused reading and reflection. Includes shuffle logic and smooth Framer Motion transitions.
- **Markdown Specification**: Export your architectures as professional `.md` files for documentation or handoff.
- **PWA Excellence**: Fully installable and offline-capable with service worker caching and a stone-washed minimalist UI.
- **Backend Persistence**: Powered by Cloudflare Durable Objects for reliable, globally distributed storage.
## Quickstart
1. **Initialize**: Click "New" or choose a "Template" from the dashboard.
2. **Architect**: Fill in the system logic. Ensure you define a `Project Name` to enable saving.
3. **Deploy**: Use the "Transmit" engine to share your logic or enter "Zen Mode" (Play Deck) to review your collection.
## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v3.
- **UI Components**: shadcn/ui (Radix UI primitives).
- **Animations**: Framer Motion 12.
- **State & Data**: Tanstack Query (React Query) + Zustand-style history patterns.
- **Backend**: Hono (Web Framework) running on Cloudflare Workers.
- **Storage**: Cloudflare Durable Objects (Stateful storage).
---
*Built for the architects of their own lives. MIT Licensed.*