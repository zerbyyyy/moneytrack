import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_ACCESS_SECRET: 'secret-de-test-uniquement-32-caracteres-minimum',
    },
    coverage: {
      provider: 'v8',
      // Objectif du dossier de cadrage : 80 % de couverture sur la logique métier
      include: ['src/domain/**'],
      exclude: ['src/**/*.test.ts'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
