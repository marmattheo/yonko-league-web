import type { PaginatedCards, CardFiltersState } from '~/types/catalog'

export const useCatalogCards = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const result = ref<PaginatedCards | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const fetch = async (params: Partial<CardFiltersState>) => {
    pending.value = true
    error.value = null

    const query: Record<string, string | number> = {}

    if (params.search)       query.search = params.search
    if (params.set)          query.set = params.set
    if (params.card_type)    query.card_type = params.card_type
    if (params.color)        query.color = params.color
    if (params.rarity)       query.rarity = params.rarity
    if (params.attribute)    query.attribute = params.attribute
    if (params.affiliation)  query.affiliation = params.affiliation
    if (params.variant)      query.variant = params.variant
    if (params.language)     query.language = params.language
    if (params.cost_min)     query.cost_min = params.cost_min
    if (params.cost_max)     query.cost_max = params.cost_max
    if (params.power_min)    query.power_min = params.power_min
    if (params.power_max)    query.power_max = params.power_max
    if (params.counter)      query.counter = params.counter
    if (params.leader_life)  query.leader_life = params.leader_life
    if (params.has_effect)   query.has_effect = params.has_effect
    if (params.has_trigger)  query.has_trigger = params.has_trigger
    if (params.sort)         query.sort = params.sort
    if (params.page)         query.page = params.page
    if (params.per_page)     query.per_page = params.per_page

    try {
      const data = await $fetch<PaginatedCards>(`${apiBase}/catalog/cards`, { query })
      result.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load cards'
      result.value = null
    } finally {
      pending.value = false
    }
  }

  return { result, pending, error, fetch }
}
