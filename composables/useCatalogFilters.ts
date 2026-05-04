import type { CatalogFilters } from '~/types/catalog'

export const useCatalogFilters = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const filters = useState<CatalogFilters | null>('catalog-filters', () => null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    if (filters.value) return
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<CatalogFilters>(`${apiBase}/catalog/filters`)
      filters.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load filters'
    } finally {
      pending.value = false
    }
  }

  return { filters, pending, error, fetch }
}
