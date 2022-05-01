import { resolve } from 'path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: resolve('packages/vue/src/index.ts'),
  output: [
    // esm cjs
    {
      format: 'cjs',
      file: resolve('lib/mini-vue.cjs.js'),
    },
    {
      format: 'esm',
      file: resolve('lib/mini-vue.esm.js'),
    },
  ],
  plugins: [typescript()],
})
