import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      fileName: 'main',
      cssFileName: 'main',
      formats: ['es', 'cjs'],
    },
    cssCodeSplit: true,
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            { src: 'lib/fonts/*', dest: 'dist/fonts' },
          ],
          hook: 'writeBundle',
        }),
      ],
    },
  },
})
