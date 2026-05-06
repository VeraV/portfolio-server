import request from 'supertest';
import app from '../src/app';
import {
  SEED,
  prisma,
  resetAndSeed,
  disconnect,
} from './helpers/db';
import { getAdminToken, authHeader } from './helpers/auth';
import { createProject, createManual } from './helpers/factories';

describe('Projects', () => {
  beforeEach(async () => {
    await resetAndSeed();
  });

  afterAll(async () => {
    await disconnect();
  });

  // ---------------------------------------------------------------
  // GET /api/projects
  // ---------------------------------------------------------------
  describe('GET /api/projects', () => {
    it('returns 200 with all projects sorted by sort_order desc', async () => {
      // Seed has one project with sort_order=1; add one with sort_order=5.
      await createProject({
        name: 'Higher Order',
        sort_order: 5,
        technologyIds: [SEED.technologies.react],
      });

      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Higher Order');
      expect(res.body[1].name).toBe('Test Project');
    });

    it('includes nested techStack with technology details', async () => {
      const res = await request(app).get('/api/projects');

      const project = res.body.find((p: any) => p.id === SEED.projects.one);
      expect(project).toBeDefined();
      expect(project.techStack).toHaveLength(2);
      expect(project.techStack[0].technology).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        logo_url: expect.any(String),
      });
    });
  });

  // ---------------------------------------------------------------
  // GET /api/projects/:id
  // ---------------------------------------------------------------
  describe('GET /api/projects/:id', () => {
    it('returns 200 with techStack and active manual + ordered steps', async () => {
      const res = await request(app).get(`/api/projects/${SEED.projects.one}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(SEED.projects.one);
      expect(res.body.techStack).toHaveLength(2);
      expect(res.body.manuals).toHaveLength(1);
      expect(res.body.manuals[0].isActive).toBe(true);
      expect(res.body.manuals[0].steps.map((s: any) => s.step_number)).toEqual([
        1, 2,
      ]);
    });

    it('excludes inactive manuals from the response', async () => {
      await createManual({
        projectId: SEED.projects.one,
        title: 'Inactive Manual',
        isActive: false,
      });

      const res = await request(app).get(`/api/projects/${SEED.projects.one}`);

      expect(res.status).toBe(200);
      expect(res.body.manuals).toHaveLength(1);
      expect(res.body.manuals[0].title).toBe('Getting Started');
    });

    it('returns 404 when project does not exist', async () => {
      const res = await request(app).get('/api/projects/does-not-exist');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Project not found');
    });
  });

  // ---------------------------------------------------------------
  // POST /api/projects
  // ---------------------------------------------------------------
  describe('POST /api/projects', () => {
    const validBody = () => ({
      name: 'New Project',
      description_short: 'Short desc',
      client_github_url: 'https://github.com/x/client',
      client_deploy_url: 'https://x.example.com',
      image_url: 'https://example.com/img.png',
      technologyIds: [SEED.technologies.react, SEED.technologies.node],
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app).post('/api/projects').send(validBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = validBody();
      delete (body as any).name;

      const res = await request(app)
        .post('/api/projects')
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error: some fields are missing');
    });

    it('creates the project and tech stack relations', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set(authHeader(getAdminToken()))
        .send(validBody());

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New Project');
      expect(res.body.techStack).toHaveLength(2);

      const links = await prisma.projectTechStack.findMany({
        where: { projectId: res.body.id },
      });
      expect(links).toHaveLength(2);
    });
  });

  // ---------------------------------------------------------------
  // PUT /api/projects/:id
  // ---------------------------------------------------------------
  describe('PUT /api/projects/:id', () => {
    const updateBody = () => ({
      name: 'Renamed Project',
      description_short: 'Updated desc',
      client_github_url: 'https://github.com/x/client',
      client_deploy_url: 'https://x.example.com',
      image_url: 'https://example.com/img.png',
      technologyIds: [SEED.technologies.postgres],
    });

    it('returns 401 without an auth token', async () => {
      const res = await request(app)
        .put(`/api/projects/${SEED.projects.one}`)
        .send(updateBody());

      expect(res.status).toBe(401);
    });

    it('returns 400 when a required field is missing', async () => {
      const body = updateBody();
      delete (body as any).image_url;

      const res = await request(app)
        .put(`/api/projects/${SEED.projects.one}`)
        .set(authHeader(getAdminToken()))
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error: some fields are missing');
    });

    it('replaces the tech stack: removes old links, adds new ones', async () => {
      const res = await request(app)
        .put(`/api/projects/${SEED.projects.one}`)
        .set(authHeader(getAdminToken()))
        .send(updateBody());

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Renamed Project');

      const links = await prisma.projectTechStack.findMany({
        where: { projectId: SEED.projects.one },
      });
      expect(links).toHaveLength(1);
      expect(links[0].technologyId).toBe(SEED.technologies.postgres);
    });
  });

  // ---------------------------------------------------------------
  // DELETE /api/projects/:id
  // ---------------------------------------------------------------
  describe('DELETE /api/projects/:id', () => {
    it('returns 401 without an auth token', async () => {
      const res = await request(app).delete(
        `/api/projects/${SEED.projects.one}`
      );

      expect(res.status).toBe(401);
    });

    it('deletes the project and cascades tech stack + manual + steps', async () => {
      const res = await request(app)
        .delete(`/api/projects/${SEED.projects.one}`)
        .set(authHeader(getAdminToken()));

      expect(res.status).toBe(200);

      const project = await prisma.project.findUnique({
        where: { id: SEED.projects.one },
      });
      expect(project).toBeNull();

      const links = await prisma.projectTechStack.findMany({
        where: { projectId: SEED.projects.one },
      });
      expect(links).toHaveLength(0);

      const manuals = await prisma.projectManual.findMany({
        where: { projectId: SEED.projects.one },
      });
      expect(manuals).toHaveLength(0);

      const steps = await prisma.manualStep.findMany({
        where: { manualId: SEED.manuals.active },
      });
      expect(steps).toHaveLength(0);
    });
  });
});
