import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/jest.env.ts'],
  globalSetup: '<rootDir>/tests/jest.globalSetup.ts',
  testTimeout: 20000,
  // Tests share one Postgres — run sequentially to avoid clobbering state.
  maxWorkers: 1,
};

export default config;
