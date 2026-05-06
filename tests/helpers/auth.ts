import jwt from 'jsonwebtoken';
import request from 'supertest';
import type { Application } from 'express';
import { SEED, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from './db';

// Mint a JWT directly. Use for tests that need an authenticated request
// but aren't testing the login flow itself — bypasses the rate limiter
// on /auth/login.
export function getAdminToken(): string {
  return jwt.sign(
    { id: SEED.admin.id, email: SEED.admin.email, name: SEED.admin.name },
    process.env.TOKEN_SECRET as string,
    { algorithm: 'HS256', expiresIn: '6h' }
  );
}

// Hit the real /auth/login endpoint. Use only in auth tests.
export async function loginViaAPI(
  app: Application,
  email: string = TEST_ADMIN_EMAIL,
  password: string = TEST_ADMIN_PASSWORD
) {
  return request(app).post('/auth/login').send({ email, password });
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
