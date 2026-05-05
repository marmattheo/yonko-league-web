<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-2 hover:border-gray-300 transition-colors">
    <!-- Header row -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <NuxtLink :to="`/sets/${set.code.toLowerCase()}`" class="text-lg font-bold text-gray-900 hover:text-teal-700 transition-colors">
          {{ set.name }}
        </NuxtLink>
        <p class="text-xs text-gray-600 font-medium mt-0.5">{{ set.code }} · {{ set.series }}</p>
      </div>
      <span v-if="set.release_date" class="text-xs text-gray-400 shrink-0">
        {{ formatDate(set.release_date) }}
      </span>
    </div>

    <!-- Stats row -->
    <div v-if="cardCount !== undefined" class="flex flex-wrap gap-3 text-sm">
      <span class="text-gray-600"><span class="text-gray-900 font-semibold">{{ cardCount }}</span> total</span>
      <span v-if="set.variant_counts?.base" class="text-gray-600"><span class="text-gray-900 font-semibold">{{ set.variant_counts.base }}</span> base</span>
      <span v-if="set.variant_counts?.alt_art" class="text-gray-600"><span class="text-gray-900 font-semibold">{{ set.variant_counts.alt_art }}</span> alt art</span>
      <span v-if="set.variant_counts?.manga" class="text-gray-600"><span class="text-gray-900 font-semibold">{{ set.variant_counts.manga }}</span> manga</span>
    </div>

    <!-- Browse button -->
    <NuxtLink :to="`/sets/${set.code.toLowerCase()}`" class="inline-flex btn-primary text-sm mt-1">
      Browse Cards →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CatalogSet } from '~/types/catalog'

const props = defineProps<{ set: CatalogSet }>()
const cardCount = computed(() => props.set.total_printings ?? props.set.total_cards)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
