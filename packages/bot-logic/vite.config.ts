import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  test: {
    //setupFiles: './src/testSetup/msw.ts',
    // @ts-ignore TODO: Find out why shows error. It works.
    coverage: {
      reportsDirectory: 'coverage',
      reporter: 'lcov'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  }
});
