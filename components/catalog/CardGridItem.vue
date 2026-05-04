<template>
  <NuxtLink
    :to="{ path: `/cards/${card.display_number}`, query: isVariant ? { printing: card.id } : {} }"
    class="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-150"
  >
    <!-- Card image -->
    <div class="p-2 pb-0">
      <CatalogCardImage
        :src="card.primary_image_url"
        :fallback-src="`https://en.onepiece-cardgame.com/images/card/${card.display_number}.png`"
        :alt="`${card.display_number} ${card.card_name}`"
        :is-reference="false"
      />
    </div>

    <!-- Card info -->
    <div class="px-2.5 py-2 flex flex-col gap-1">
      <!-- Set code: Set name · LANG -->
      <p class="text-xs text-gray-400 truncate">
        <span class="font-medium text-gray-500">{{ card.set_code?.code }}</span>
        <span v-if="card.set_code?.name">: {{ card.set_code.name }}</span>
        <span v-if="langLabel"> · {{ langLabel }}</span>
      </p>

      <!-- Card number | variant label -->
      <p class="text-xs font-mono text-gray-700 truncate">
        {{ card.display_number }}<span v-if="variantLabel" class="font-medium"> | {{ variantLabel }}</span>
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Card } from '~/types/catalog'

const props = defineProps<{ card: Card }>()

// Any printing that isn't the plain base card
const isVariant = computed(() =>
  props.card.is_parallel || (props.card.variant_type?.code && props.card.variant_type.code !== 'NORMAL')
)

const variantLabel = computed(() => {
  if (!isVariant.value) return null
  const code = props.card.variant_type?.code
  if (code === 'MANGA') return 'Manga'
  if (code === 'SP_CARD') return 'SP'
  if (code === 'ALT_ART') return 'Alt Art'
  return 'Alternate Art'
})

const langLabel = computed(() => {
  const code = props.card.language?.code
  if (!code) return null
  const map: Record<string, string> = { ZH_HANS: 'SC', ZH_HANT: 'TC' }
  return map[code] ?? code
})
</script>


