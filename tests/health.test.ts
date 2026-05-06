import request from 'supertest';
import app from '../src/app';

describe('Health check', () => {
  it('GET /api/health returns 200 OK', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
