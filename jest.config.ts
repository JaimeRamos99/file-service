import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      moduleFileExtensions: ['js', 'ts'],
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      moduleFileExtensions: ['js', 'ts'],
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
    },
  ],
};

export default config;
