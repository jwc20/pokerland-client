/**
 * Classes (leagues, and practising hands shared with a class) aren't open yet. Until VITE_CLASSES_ENABLED is "true",
 * with CLASSES_ENABLED on the API too, their links and buttons show but are disabled, and nothing asks the API about
 * them.
 */
export const CLASSES_ENABLED = import.meta.env.VITE_CLASSES_ENABLED === 'true'

/** What a disabled classes link or button says on hover. */
export const CLASSES_CLOSED = 'Classes aren’t open yet'

/**
 * Explanations written by a model with the player's own key (pokerland-llm-reports.md): on unless
 * VITE_EXPLANATIONS_ENABLED is "false", with EXPLANATIONS_ENABLED on the API to match.
 */
export const EXPLANATIONS_ENABLED = import.meta.env.VITE_EXPLANATIONS_ENABLED !== 'false'
