import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node', // Changed from jsdom to avoid browser conflicts
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.spec.ts', 'tests/integration/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/collections/**',
        'src/globals/**',
        'src/lib/**',
        'src/access/**',
        'src/fields/**',
      ],
      exclude: [
        'src/payload-types.ts',
        'src/app/**', // Exclude Next.js app router files
        'tests/**',
      ],
      reporter: ['text', 'html', 'json'],
    },
    testTimeout: 30000,
  },
})
