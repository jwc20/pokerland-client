import type { Adapter, ProviderId } from './types.ts'

/**
 * Each provider's adapter, loaded with its SDK only when that provider is first used, so none of the SDKs is in the
 * main bundle.
 */
const loaders: Record<ProviderId, () => Promise<Adapter>> = {
  anthropic: () => import('./anthropic.ts').then((module) => module.anthropic),
  openai: () => import('./openai.ts').then((module) => module.openai),
  google: () => import('./google.ts').then((module) => module.google),
  deepseek: () => import('./deepseek.ts').then((module) => module.deepseek),
}

export function adapterFor(provider: ProviderId): Promise<Adapter> {
  return loaders[provider]()
}
