// Set test env vars before any app/source modules load.
// dotenv (called in src/app.ts) does NOT override pre-existing env vars,
// so anything set here wins over .env values.

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:test@localhost:5433/portfolio_test';
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test-secret';
process.env.ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
