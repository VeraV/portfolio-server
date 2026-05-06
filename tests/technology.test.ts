import request from 'supertest';
import type { Express } from 'express';
import {
  SEED,
  prisma,
  resetAndSeed,
  disconnect,
} from './helpers/db';
import { getAdminToken, authHeader } from './helpers/auth';
import { createTechnology } from './helpers/factories';

const app: Express = require('../src/app');

describe('Technology', () => {
  beforeEach(async () => {
    await resetAndSeed();
  });

  afterAll(async () => {
    await disconnect();
  });

  // ---------------------------------------------------------------
  // GET /api/technology
  // ---------------------------------------------------------------
  describe('GET /api/technology', () => {
    it('returns technologies sorted by sort_order asc with category included', async () => {
      const res = await request(app).get('/api/technology');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      // Seed: React (1), Node.js (2), PostgreSQL (3) — already in asc order.
      expect(res.body.map((t: any) => t.name)).toEqual([
        'React',
        'Node.js',
        'PostgreSQL',
      ]);
      expect(res.body[0].category).toMatchObject({
        id: SEED.categories.frontend,
        name: 'front-end',
      });
    });

    it('places technologies with null sort_order after numbered ones', async () => {
      // Add a tech without sort_order — Prisma puts NULLs last in asc order by default.
      await createTechnology({
        name: 'Unsorted',
        categoryId: SEED.categories.backend,
        sort_order: null,
      });

      const res = await request(app).get('/api/technology');

      expect(res.status).toBe(200);
      expect(res.body[res.body.length - 1].name).toBe('Unsorted');
    });
  });

  // ---------------------------------------------------------------
  // POST /api/technology
  // ---------------------------------------------------------------
  describe('POST /api/technology', () => {
    const validBody = () => ({
      name: 'Brand New Tech',
      logo_url: 'https://example.com/logo.png',
      official_site_url: 'https://example.com',
      categoryId: SEED.categories.frontend,
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app)
        .post('/api/technology')
        .send(validBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = validBody();
      delete (body as any).logo_url;

      const res = await request(app)
        .post('/api/technology')
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error: some fields are missing');
    });

    it('creates the technology and returns it with its category', async () => {
      const res = await request(app)
        .post('/api/technology')
        .set(authHeader(getAdminToken()))
        .send(validBody());

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Brand New Tech');
      expect(res.body.category).toMatchObject({
        id: SEED.categories.frontend,
        name: 'front-end',
      });

      const persisted = await prisma.technology.findUnique({
        where: { id: res.body.id },
      });
      expect(persisted).not.toBeNull();
    });
  });

  // ---------------------------------------------------------------
  // GET /api/tech-category
  // ---------------------------------------------------------------
  describe('GET /api/tech-category', () => {
    it('returns all seeded tech categories', async () => {
      const res = await request(app).get('/api/tech-category');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body.map((c: any) => c.name).sort()).toEqual([
        'back-end',
        'front-end',
      ]);
    });
  });
});
