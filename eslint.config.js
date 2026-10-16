import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// The model providers' SDKs are imported by their adapters alone (src/explain/providers/), and the players' API keys'
// storage is touched by src/explain/keyStore.ts alone (pokerland-llm-reports.md, 4).
const SDKS = ['@anthropic-ai/sdk', 'openai', '@google/genai']
const ADAPTERS = {
  '@anthropic-ai/sdk': ['src/explain/providers/anthropic.ts'],
  openai: ['src/explain/providers/openai.ts', 'src/explain/providers/deepseek.ts'],
  '@google/genai': ['src/explain/providers/google.ts'],
}
const KEY_STORE = 'src/explain/keyStore.ts'

function onlyIn(sdk) {
  return {
    files: ADAPTERS[sdk],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: SDKS.filter((other) => other !== sdk).map((other) => ({ group: [other, `${other}/*`] })) },
      ],
    },
  }
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: SDKS.map((sdk) => ({
            group: [sdk, `${sdk}/*`],
            message: 'Only its adapter in src/explain/providers/ imports a model provider’s SDK.',
          })),
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value='pokerland-model-keys']",
          message: 'Only src/explain/keyStore.ts touches the API keys’ storage.',
        },
      ],
    },
  },
  ...Object.keys(ADAPTERS).map(onlyIn),
  { files: [KEY_STORE], rules: { 'no-restricted-syntax': 'off' } },
])
