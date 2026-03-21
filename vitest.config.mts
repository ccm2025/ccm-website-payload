import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.ts'],
    globals: true,
    pool: 'forks',
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    testTimeout: 10000,
  },
  define: {
    global: 'globalThis',
  },
})
