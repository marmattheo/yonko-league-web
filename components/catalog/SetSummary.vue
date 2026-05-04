<template>
  <div class="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
    <!-- Header row -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <NuxtLink :to="`/sets/${set.code.toLowerCase()}`" class="text-lg font-bold text-white hover:text-red-400 transition-colors">
          {{ set.name }}
        </NuxtLink>
        <p class="text-xs text-gray-500 mt-0.5">{{ set.code }} · {{ set.series }}</p>
      </div>
      <span v-if="set.release_date" class="text-xs text-gray-500 shrink-0">
        {{ formatDate(set.release_date) }}
      </span>
    </div>

    <!-- Stats row -->
    <div v-if="set.total_cards !== undefined" class="flex flex-wrap gap-3 text-sm">
      <span class="text-gray-300"><span class="text-white font-semibold">{{ set.total_cards }}</span> cards</span>
      <span v-if="set.base_count" class="text-gray-300"><span class="text-white font-semibold">{{ set.base_count }}</span> base</span>
      <template v-if="set.variant_counts">
        <span v-for="(count, code) in set.variant_counts" :key="code" class="text-gray-300">
          <span class="text-white font-semibold">{{ count }}</span> {{ code.toLowerCase().replace('_', ' ') }}
        </span>
      </template>
    </div>

    <!-- Browse button -->
    <NuxtLink :to="`/sets/${set.code.toLowerCase()}`" class="inline-flex btn-primary text-sm mt-1">
      Browse Cards →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CatalogSet } from '~/types/catalog'

defineProps<{ set: CatalogSet }>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
