import request from 'supertest';
import jwt from 'jsonwebtoken';
import type { Express } from 'express';
import {
  TEST_ADMIN_EMAIL,
  TEST_ADMIN_PASSWORD,
  SEED,
  resetAndSeed,
  disconnect,
} from './helpers/db';
import { getAdminToken } from './helpers/auth';

const app: Express = require('../src/app');

describe('Auth', () => {
  beforeAll(async () => {
    await resetAndSeed();
  });

  afterAll(async () => {
    await disconnect();
  });

  // ---------------------------------------------------------------
  // POST /auth/login
  //
  // The rate limiter caps at 5 attempts per 15 min per IP. The five
  // tests below use exactly 5 attempts; the rate-limit test that
  // follows then trips the 6th request → 429. If you add another
  // /auth/login call to this describe block, also adjust the rate
  // limit test position.
  // ---------------------------------------------------------------
  describe('POST /auth/login', () => {
    it('returns 400 when email is empty', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: '', password: 'something' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Provide email and password.');
    });

    it('returns 400 when password is empty', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: TEST_ADMIN_EMAIL, password: '' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Provide email and password.');
    });

    it('returns 401 when email is not found', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'whatever' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('User not found.');
    });

    it('returns 401 when password is wrong', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: TEST_ADMIN_EMAIL, password: 'WrongPassword!!!' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unable to authenticate the user');
    });

    it('returns 200 with a signed JWT for valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD });

      expect(res.status).toBe(200);
      expect(typeof res.body.authToken).toBe('string');

      const decoded = jwt.verify(
        res.body.authToken,
        process.env.TOKEN_SECRET as string
      ) as { id: string; email: string; name: string };

      expect(decoded.id).toBe(SEED.admin.id);
      expect(decoded.email).toBe(SEED.admin.email);
      expect(decoded.name).toBe(SEED.admin.name);
    });

    it('returns 429 after the rate limit is exceeded', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD });

      expect(res.status).toBe(429);
      expect(res.body.message).toBe(
        'Too many login attempts. Please try again later.'
      );
    });
  });

  // ---------------------------------------------------------------
  // GET /auth/verify
  // ---------------------------------------------------------------
  describe('GET /auth/verify', () => {
    it('returns 200 with the decoded payload when token is valid', async () => {
      const token = getAdminToken();

      const res = await request(app)
        .get('/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(SEED.admin.id);
      expect(res.body.email).toBe(SEED.admin.email);
      expect(res.body.name).toBe(SEED.admin.name);
    });

    it('returns 401 when no token is provided', async () => {
      const res = await request(app).get('/auth/verify');

      expect(res.status).toBe(401);
    });

    it('returns 401 when the token signature is invalid', async () => {
      const res = await request(app)
        .get('/auth/verify')
        .set('Authorization', 'Bearer not-a-valid-token');

      expect(res.status).toBe(401);
    });
  });
});
