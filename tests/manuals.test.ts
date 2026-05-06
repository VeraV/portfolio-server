import request from 'supertest';
import app from '../src/app';
import {
  SEED,
  prisma,
  resetAndSeed,
  disconnect,
} from './helpers/db';
import { getAdminToken, authHeader } from './helpers/auth';
import { createManual, createProject } from './helpers/factories';

describe('Manuals', () => {
  beforeEach(async () => {
    await resetAndSeed();
  });

  afterAll(async () => {
    await disconnect();
  });

  // ---------------------------------------------------------------
  // GET /api/manuals/:projectId
  // ---------------------------------------------------------------
  describe('GET /api/manuals/:projectId', () => {
    it('returns manuals sorted by version desc with only selected fields', async () => {
      await createManual({
        projectId: SEED.projects.one,
        title: 'Newer Manual',
        version: '2.0',
        isActive: false,
      });

      const res = await request(app).get(
        `/api/manuals/${SEED.projects.one}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].version).toBe('2.0');
      expect(res.body[1].version).toBe('1.0');

      // Spec says only id, title, description, version, isActive are selected.
      expect(Object.keys(res.body[0]).sort()).toEqual(
        ['description', 'id', 'isActive', 'title', 'version'].sort()
      );
    });

    it('returns an empty array for a project with no manuals', async () => {
      const project = await createProject({ name: 'No Manuals' });

      const res = await request(app).get(`/api/manuals/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // ---------------------------------------------------------------
  // POST /api/manuals
  // ---------------------------------------------------------------
  describe('POST /api/manuals', () => {
    const validBody = () => ({
      projectId: SEED.projects.one,
      title: 'Brand New Manual',
      description: 'Fresh manual',
      version: '3.0',
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app).post('/api/manuals').send(validBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = validBody();
      delete (body as any).title;

      const res = await request(app)
        .post('/api/manuals')
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error: some fields are missing');
    });

    it('creates the manual with isActive=false and an empty steps array', async () => {
      const res = await request(app)
        .post('/api/manuals')
        .set(authHeader(getAdminToken()))
        .send(validBody());

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Brand New Manual');
      expect(res.body.isActive).toBe(false);
      expect(res.body.steps).toEqual([]);
    });
  });

  // ---------------------------------------------------------------
  // PATCH /api/manuals/:id
  // ---------------------------------------------------------------
  describe('PATCH /api/manuals/:id', () => {
    const updateBody = () => ({
      title: 'Updated Title',
      description: 'Updated description',
      version: '1.1',
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app)
        .patch(`/api/manuals/${SEED.manuals.active}`)
        .send(updateBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = updateBody();
      delete (body as any).version;

      const res = await request(app)
        .patch(`/api/manuals/${SEED.manuals.active}`)
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error: some fields are missing');
    });

    it('updates title/description/version without changing isActive', async () => {
      const res = await request(app)
        .patch(`/api/manuals/${SEED.manuals.active}`)
        .set(authHeader(getAdminToken()))
        .send(updateBody());

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.description).toBe('Updated description');
      expect(res.body.version).toBe('1.1');
      // Seeded manual is active; PATCH must not flip it.
      expect(res.body.isActive).toBe(true);
    });
  });

  // ---------------------------------------------------------------
  // PATCH /api/manuals/:projectId/:id/set-active
  // ---------------------------------------------------------------
  describe('PATCH /api/manuals/:projectId/:id/set-active', () => {
    it('returns 401 without an auth token', async () => {
      const res = await request(app).patch(
        `/api/manuals/${SEED.projects.one}/${SEED.manuals.active}/set-active`
      );

      expect(res.status).toBe(401);
    });

    it('activates the target manual and deactivates all others on the same project', async () => {
      const newManual = await createManual({
        projectId: SEED.projects.one,
        title: 'New Active',
        version: '2.0',
        isActive: false,
      });

      const res = await request(app)
        .patch(
          `/api/manuals/${SEED.projects.one}/${newManual.id}/set-active`
        )
        .set(authHeader(getAdminToken()));

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(newManual.id);
      expect(res.body.isActive).toBe(true);
      expect(Array.isArray(res.body.steps)).toBe(true);

      // Previously-active manual must have flipped to inactive.
      const previouslyActive = await prisma.projectManual.findUnique({
        where: { id: SEED.manuals.active },
      });
      expect(previouslyActive?.isActive).toBe(false);
    });
  });

  // ---------------------------------------------------------------
  // DELETE /api/manuals/:id
  // ---------------------------------------------------------------
  describe('DELETE /api/manuals/:id', () => {
    it('returns 401 without an auth token', async () => {
      const res = await request(app).delete(
        `/api/manuals/${SEED.manuals.active}`
      );

      expect(res.status).toBe(401);
    });

    it('deletes the manual and cascades its steps', async () => {
      const res = await request(app)
        .delete(`/api/manuals/${SEED.manuals.active}`)
        .set(authHeader(getAdminToken()));

      expect(res.status).toBe(200);

      const manual = await prisma.projectManual.findUnique({
        where: { id: SEED.manuals.active },
      });
      expect(manual).toBeNull();

      const steps = await prisma.manualStep.findMany({
        where: { manualId: SEED.manuals.active },
      });
      expect(steps).toHaveLength(0);
    });
  });
});
