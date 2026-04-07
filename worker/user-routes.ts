import { Hono } from "hono";
import type { Env } from './core-utils';
import { SystemCardEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { SYSTEM_CARD_TEMPLATES } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CARDS
  app.get('/api/cards', async (c) => {
    await SystemCardEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const page = await SystemCardEntity.list(c.env, cursor ?? null, limit ? parseInt(limit) : 50);
    return ok(c, page);
  });
  app.get('/api/cards/:id', async (c) => {
    const card = new SystemCardEntity(c.env, c.req.param('id'));
    if (!await card.exists()) return notFound(c, 'Card not found');
    return ok(c, await card.getState());
  });
  app.post('/api/cards', async (c) => {
    const data = await c.req.json();
    if (!data.projectName?.trim()) return bad(c, 'Project name required (non-whitespace)');
    data.projectName = data.projectName.trim();
    const now = Date.now();
    const newCard = {
      ...SystemCardEntity.initialState,
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    return ok(c, await SystemCardEntity.create(c.env, newCard));
  });
  app.patch('/api/cards/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const card = new SystemCardEntity(c.env, id);
    if (!await card.exists()) return notFound(c, 'Card not found');
    if (!updates.projectName?.trim()) return bad(c, 'Project name required (non-whitespace)');
    const { id: _, createdAt: __, ...safeUpdates } = updates;
    const finalUpdates = {
      ...safeUpdates,
      updatedAt: Date.now()
    };
    await card.patch(finalUpdates);
    return ok(c, await card.getState());
  });
  app.delete('/api/cards/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await SystemCardEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.post('/api/cards/deleteMany', async (c) => {
    const { ids } = await c.req.json();
    if (!Array.isArray(ids)) return bad(c, 'Invalid ids array');
    const count = await SystemCardEntity.deleteMany(c.env, ids);
    return ok(c, { count });
  });
  // TEMPLATES
  app.get('/api/templates', (c) => ok(c, SYSTEM_CARD_TEMPLATES));
}