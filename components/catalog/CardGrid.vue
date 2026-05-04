<template>
  <!-- Error state -->
  <div v-if="error" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
    <div class="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
      <svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div>
      <p class="text-teal-600 font-semibold">Failed to load cards</p>
      <p class="text-gray-500 text-sm mt-1">{{ error }}</p>
    </div>
  </div>

  <template v-else>
    <!-- Initial skeleton (no cards yet at all) -->
    <div v-if="loading && !cards?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="bg-white rounded-xl border border-gray-200 animate-pulse"
      >
        <div class="p-2 pb-0">
          <div class="aspect-[2/3] bg-gray-100 rounded-lg" />
        </div>
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-100 rounded w-2/3" />
          <div class="h-4 bg-gray-100 rounded" />
          <div class="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Empty state (not loading, no results) -->
    <div v-else-if="!loading && !cards?.length" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p class="text-gray-700 font-semibold">No cards found</p>
        <p class="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
      </div>
    </div>

    <!-- Grid — stays visible while re-fetching, just dims slightly -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-200"
      :class="loading ? 'opacity-50 pointer-events-none' : 'opacity-100'"
    >
      <CatalogCardGridItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Card } from '~/types/catalog'

withDefaults(defineProps<{
  cards?: Card[]
  loading?: boolean
  error?: string | null
  skeletonCount?: number
}>(), {
  skeletonCount: 24,
})
</script>
