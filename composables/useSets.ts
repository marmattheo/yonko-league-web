import type { CatalogSet } from '~/types/catalog'

export const useSets = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const sets = useState<CatalogSet[]>('catalog-sets', () => [])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const fetchAll = async () => {
    if (sets.value.length) return
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<CatalogSet[]>(`${apiBase}/catalog/sets`)
      sets.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load sets'
    } finally {
      pending.value = false
    }
  }

  const fetchOne = async (setCode: string): Promise<CatalogSet | null> => {
    try {
      return await $fetch<CatalogSet>(`${apiBase}/catalog/sets/${setCode}`)
    } catch {
      return null
    }
  }

  return { sets, pending, error, fetchAll, fetchOne }
}
