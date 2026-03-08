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
    fileParallelism: false, // 禁用文件并行执行
    sequence: {
      concurrent: false, // 禁用并发测试
    },
    testTimeout: 10000, // 增加超时时间
  },
  define: {
    global: 'globalThis',
  },
})
