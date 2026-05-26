import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['shared/**', 'api/**'],
      exclude: ['**/node_modules/**', '**/types/**'],
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@api': path.resolve(__dirname, 'api'),
      '@web': path.resolve(__dirname, 'web'),
    },
  },
});
