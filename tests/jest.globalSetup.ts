import { execSync } from 'node:child_process';

// Runs once before the whole test suite. Applies pending Prisma migrations
// to the test database so every test file starts against an up-to-date schema.
export default async function globalSetup() {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    'postgresql://postgres:test@localhost:5433/portfolio_test';

  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'pipe',
      env: process.env,
    });
  } catch (err) {
    console.error(
      '\n❌ Could not apply migrations to the test database.\n' +
        '   Is the Docker Postgres container running on :5433?\n' +
        '   From the repo root: docker compose up -d\n'
    );
    throw err;
  }
}
