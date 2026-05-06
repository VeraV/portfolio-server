import request from 'supertest';
import type { Express } from 'express';
import {
  SEED,
  prisma,
  resetAndSeed,
  disconnect,
} from './helpers/db';
import { getAdminToken, authHeader } from './helpers/auth';
import { createManual } from './helpers/factories';

const app: Express = require('../src/app');

describe('Manual Steps', () => {
  beforeEach(async () => {
    await resetAndSeed();
  });

  afterAll(async () => {
    await disconnect();
  });

  // ---------------------------------------------------------------
  // POST /api/steps
  // ---------------------------------------------------------------
  describe('POST /api/steps', () => {
    const validBody = () => ({
      manualId: SEED.manuals.active,
      description: 'New step description',
      image_url: 'https://example.com/new-step.png',
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app).post('/api/steps').send(validBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = validBody();
      delete (body as any).description;

      const res = await request(app)
        .post('/api/steps')
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All step fields are required.');
    });

    it('auto-increments step_number based on existing max', async () => {
      // Seed has 2 steps in this manual → next should be 3.
      const res = await request(app)
        .post('/api/steps')
        .set(authHeader(getAdminToken()))
        .send(validBody());

      expect(res.status).toBe(201);
      expect(res.body.step_number).toBe(3);
      expect(res.body.manualId).toBe(SEED.manuals.active);
    });

    it('starts step_number at 1 for an empty manual', async () => {
      const emptyManual = await createManual({
        projectId: SEED.projects.one,
        title: 'Empty',
        version: '0.1',
      });

      const res = await request(app)
        .post('/api/steps')
        .set(authHeader(getAdminToken()))
        .send({
          manualId: emptyManual.id,
          description: 'First step',
          image_url: 'https://example.com/step.png',
        });

      expect(res.status).toBe(201);
      expect(res.body.step_number).toBe(1);
    });
  });

  // ---------------------------------------------------------------
  // PATCH /api/steps/:stepId
  // ---------------------------------------------------------------
  describe('PATCH /api/steps/:stepId', () => {
    const updateBody = () => ({
      description: 'Updated description',
      image_url: 'https://example.com/updated.png',
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app)
        .patch(`/api/steps/${SEED.steps.first}`)
        .send(updateBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = updateBody();
      delete (body as any).image_url;

      const res = await request(app)
        .patch(`/api/steps/${SEED.steps.first}`)
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Description and image are required.');
    });

    it('updates description and image_url without changing step_number or manualId', async () => {
      const before = await prisma.manualStep.findUnique({
        where: { id: SEED.steps.first },
      });

      const res = await request(app)
        .patch(`/api/steps/${SEED.steps.first}`)
        .set(authHeader(getAdminToken()))
        .send(updateBody());

      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Updated description');
      expect(res.body.image_url).toBe('https://example.com/updated.png');
      expect(res.body.step_number).toBe(before?.step_number);
      expect(res.body.manualId).toBe(before?.manualId);
    });
  });
});
