# Cloudflare Workers React Chat Demo

[cloudflarebutton]

A production-ready full-stack chat application built with Cloudflare Workers, Durable Objects, React, and Tailwind CSS. Demonstrates scalable entity-based storage using one Durable Object instance per User or Chat, with efficient indexing for listings.

## Features

- **Real-time Chat Boards**: Each chat is a dedicated Durable Object storing messages with atomic mutations.
- **Entity Indexing**: Prefix-based indexes for paginated listings of users and chats.
- **Type-safe API**: Hono-based backend with shared TypeScript types between frontend and worker.
- **Modern UI**: Shadcn/UI components with New York style, Tailwind CSS, dark mode support.
- **State Management**: TanStack Query for data fetching, caching, and mutations.
- **Error Handling**: Comprehensive error boundaries and client error reporting.
- **Seed Data**: Mock users, chats, and messages auto-populated on first access.
- **Responsive Design**: Mobile-friendly sidebar layout with theme toggle.

## Tech Stack

- **Backend**: Cloudflare Workers, Durable Objects, Hono
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Lucide Icons
- **Data Fetching**: TanStack React Query
- **Utilities**: Immer, Zod, Framer Motion, Sonner (toasts), React Router
- **Package Manager**: Bun
- **Deployment**: Wrangler

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated (`wrangler login`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd architect-paradox-coxlnbtpochejafehbey9
   bun install
   ```

3. **Development**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

4. **Type Generation** (if needed):
   ```bash
   bun run cf-typegen
   ```

## Development

- **Frontend**: Lives in `src/`. Hot-reloads during `bun dev`.
- **Backend**: Routes in `worker/user-routes.ts`. Add custom routes there (never edit `worker/index.ts`).
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts` for new models.
- **API Client**: Use `api()` from `src/lib/api-client.ts` for type-safe fetches.
- **Linting**: `bun lint`
- **Build**: `bun build`

### API Endpoints

- `GET /api/users` - List users (paginated)
- `POST /api/users` - Create user `{ name: string }`
- `GET /api/chats` - List chats (paginated)
- `POST /api/chats` - Create chat `{ title: string }`
- `GET /api/chats/:chatId/messages` - Get messages
- `POST /api/chats/:chatId/messages` - Send `{ userId: string, text: string }`
- Delete endpoints for users/chats (single & batch)

## Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun run deploy
```

This builds the frontend assets and deploys the Worker. Your app will be live at `<your-worker>.<your-subdomain>.workers.dev`.

For production:

1. Update `wrangler.jsonc` with your settings.
2. Set custom domain via Wrangler or dashboard.
3. Enable Workers Analytics Engine for observability.

[cloudflarebutton]

## Architecture

- **Single Global DO**: `GlobalDurableObject` acts as shared KV-like storage.
- **Per-Entity DOs**: Named instances (`user:<id>`, `chat:<id>`) for strong consistency.
- **Indexes**: Separate DOs for efficient paginated listings.
- **SPA Assets**: Vite-built React app served via Worker with SPA fallback.

## Customization

- **UI**: Edit `src/pages/HomePage.tsx` or add routes in `src/main.tsx`.
- **Entities**: See `worker/entities.ts` examples. Add new classes extending `IndexedEntity`.
- **Sidebar**: Customize `src/components/app-sidebar.tsx` or remove `AppLayout`.
- **Theme**: Tailwind config in `tailwind.config.js`, CSS vars in `src/index.css`.

## Troubleshooting

- **Worker Routes Fail**: Check console for `user-routes.ts` import errors.
- **Types Missing**: Run `bun run cf-typegen`.
- **CORS Issues**: Pre-configured for `/api/*`.
- **Dev vs Prod**: Uses `import.meta.env.DEV` for hot-reload.

## License

MIT. See [LICENSE](LICENSE) for details.

---

⭐ **Star on GitHub** · 🔒 **Cloudflare Account Required** · 📚 **Docs**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)