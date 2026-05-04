import type { Card } from '~/types/catalog'

export const useCardDetail = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const card = ref<Card | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const fetch = async (displayNumber: string) => {
    pending.value = true
    error.value = null
    card.value = null
    try {
      const data = await $fetch<Card>(`${apiBase}/catalog/cards/${displayNumber}`)
      card.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Card not found'
    } finally {
      pending.value = false
    }
  }

  return { card, pending, error, fetch }
}
