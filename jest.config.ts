// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',

  // ✅ Helps Jest resolve `src/...` paths (matching tsconfig.json)
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // ✅ Optional: if you're using Prisma
  // Add these if prisma generates files outside Jest scope
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;
