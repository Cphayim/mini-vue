import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: [
      {
        find: /^@cphayim\/vue-(.*)$/,
        replacement: resolve(__dirname, 'packages/$1/src'),
      },
    ],
  },
  test: {
    environment: 'node',
    include: ['packages/**/__tests__/**/*.ts'],
    coverage: {
      include: ['packages/**/src/**/*.ts'],
      reporter: ['text', 'lcov'],
      statements: 90,
    },
  },
})
