/**
 * Session-level catalog state.
 *
 * Module-level refs persist across client-side navigation but are reset on
 * hard page refresh — no localStorage, no SSR leakage.
 *
 * userClearedLanguage: set to true when the user explicitly removes the
 * language filter (clicks ✕ on the language chip or toggles the active
 * language pill off). While true, the default EN language injection on the
 * /cards page is suppressed so the user sees all language variants.
 * Resets to false when the user clicks "Reset filters" or refreshes the page.
 */
import { ref } from 'vue'

const userClearedLanguage = ref(false)

export function useCatalogSession() {
  return { userClearedLanguage }
}
