<template>
  <NuxtLink
    :to="`/cards/${card.display_number}`"
    class="group flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
  >
    <!-- Card image -->
    <div class="p-2 pb-0">
      <CatalogCardImage
        :src="card.primary_image_url"
        :alt="`${card.display_number} ${card.card_name}`"
        :is-reference="false"
      />
    </div>

    <!-- Card info -->
    <div class="p-3 flex flex-col gap-2 flex-1">
      <!-- Number + name -->
      <div>
        <p class="text-xs text-gray-500 font-mono">{{ card.display_number }}</p>
        <p class="text-sm font-semibold text-white leading-tight line-clamp-2">{{ card.card_name }}</p>
      </div>

      <!-- Badges -->
      <CatalogCardBadges
        :colors="card.colors"
        :card-type="card.card_type"
        :rarity="card.rarity"
        :variant-type="card.variant_type"
      />

      <!-- Stats -->
      <CatalogCardStats :card="card" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Card } from '~/types/catalog'

defineProps<{ card: Card }>()
</script>
