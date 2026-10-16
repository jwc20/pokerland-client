import { appendFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const buildId = process.env.BUILD_ID ?? new Date().toISOString()

// The model providers a player's browser may call with their own key (src/explain/providers/).
const PROVIDERS = [
  'https://api.anthropic.com',
  'https://api.openai.com',
  'https://generativelanguage.googleapis.com',
  'https://api.deepseek.com',
]

/**
 * The Content-Security-Policy for every page (pokerland-llm-reports.md, 4.3): scripts, styles and images from the app
 * alone, and requests only to the app, its API and the providers, so a script that got in couldn't send a key
 * anywhere else. index.html has no inline script, so script-src 'self' holds.
 */
function contentSecurityPolicy(apiBaseUrl: string) {
  const api = new URL(apiBaseUrl).origin
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self' ${[api, ...PROVIDERS].join(' ')}`,
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; ')
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  let outDir = 'dist'
  return {
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
      {
        // Cloudflare reads _headers (public/_headers, copied into the build); the policy names this mode's API.
        name: 'content-security-policy',
        apply: 'build',
        configResolved(config) {
          outDir = resolve(config.root, config.build.outDir)
        },
        closeBundle() {
          const headers = resolve(outDir, '_headers')
          if (!env.VITE_API_BASE_URL || !existsSync(headers)) return
          appendFileSync(headers, `\n/*\n  Content-Security-Policy: ${contentSecurityPolicy(env.VITE_API_BASE_URL)}\n`)
        },
      },
    ],
  }
})
