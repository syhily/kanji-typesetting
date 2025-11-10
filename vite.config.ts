import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      fileName: 'main',
      cssFileName: 'main',
      formats: ['es', 'cjs'],
    },
    cssCodeSplit: true,
  },
  plugins: [
    tsconfigPaths(),
    dts({
      outDir: ['dist'],
      staticImport: true,
    }),
  ],
})
