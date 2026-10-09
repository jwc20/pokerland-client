interface ImportMetaEnv {
  /** Base URL of pokerland-api, no trailing slash. See .env.example. */
  readonly VITE_API_BASE_URL: string
  /** "true" opens classes (src/features.ts); anything else, or nothing, keeps them closed. */
  readonly VITE_CLASSES_ENABLED?: string
}
