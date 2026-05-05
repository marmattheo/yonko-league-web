<template>
  <NuxtLink
    :to="{ path: `/cards/${card.display_number}`, query: isVariant ? { printing: card.id } : {} }"
    class="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
  >
    <!-- Card image -->
    <div class="p-1.5 pb-0">
      <CatalogCardImage
        :src="card.primary_image_url"
        :fallback-src="`https://en.onepiece-cardgame.com/images/card/${card.display_number}.png`"
        :alt="`${card.display_number} ${card.card_name}`"
        :is-reference="false"
      />
    </div>

    <!-- Card info -->
    <div class="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
      <!-- Card name -->
      <p class="text-sm font-semibold text-gray-900 truncate leading-snug group-hover:text-teal-700 transition-colors">
        {{ card.card_name }}
      </p>

      <!-- Card number + variant -->
      <p class="text-xs font-mono text-gray-400 truncate">
        {{ card.display_number }}
        <span v-if="variantLabel" class="text-teal-500 font-medium not-italic"> · {{ variantLabel }}</span>
      </p>

      <!-- Badges row: rarity + type + language -->
      <div class="flex items-center gap-1 flex-wrap min-h-[16px]">
        <span
          v-if="card.rarity"
          class="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded leading-none"
        >
          {{ card.rarity.code }}
        </span>

        <span
          v-if="specialTypeLabel"
          class="text-[10px] font-bold px-1.5 py-0.5 rounded leading-none"
          :class="specialTypeClass"
        >
          {{ specialTypeLabel }}
        </span>

        <span
          v-if="langLabel"
          class="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded leading-none ml-auto"
        >
          {{ langLabel }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Card } from '~/types/catalog'

const props = defineProps<{ card: Card }>()

const isVariant = computed(() =>
  props.card.variant_type?.code && props.card.variant_type.code !== 'NORMAL'
)

const variantLabel = computed(() => {
  if (!isVariant.value) return null
  const code = props.card.variant_type?.code
  if (code === 'MANGA') return 'Manga'
  if (code === 'SP_CARD') return 'SP'
  return 'Alt Art'
})

const langLabel = computed(() => {
  const code = props.card.language?.code
  if (!code) return null
  const map: Record<string, string> = { ZH_HANS: 'SC', ZH_HANT: 'TC' }
  return map[code] ?? code
})

const specialTypeLabel = computed(() => {
  const code = props.card.card_type?.code
  if (code === 'LEADER') return 'LEADER'
  if (code === 'DON') return 'DON!!'
  return null
})

const specialTypeClass = computed(() => {
  const code = props.card.card_type?.code
  if (code === 'LEADER') return 'bg-yellow-100 text-yellow-700'
  if (code === 'DON') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
})
</script>
