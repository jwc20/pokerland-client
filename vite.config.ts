import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const buildId = process.env.BUILD_ID ?? new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [
    react(),
    {
      name: 'emit-version-json',
      apply: 'build',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ id: buildId }),
        })
      },
    },
  ],
})
