// Test configuration for the server test suite (Jest + Supertest).
//
// IMPORTANT: These values are duplicated in tests/playwright.config.ts
// (a separate git repo, so we cannot share imports). If you change any
// value here, update the matching constant there — both the seed script
// and Playwright tests rely on these exact values.

export const TEST_DATABASE_URL =
  'postgresql://postgres:test@localhost:5433/portfolio_test';
export const TEST_ADMIN_EMAIL = 'admin@portfolio.com';
export const TEST_ADMIN_PASSWORD = 'TestAdminPassword123!';
export const TEST_TOKEN_SECRET = 'test-secret-not-for-production';
