<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-20 px-4 text-center overflow-hidden">
      <!-- Subtle background texture -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent pointer-events-none" />
      <div class="relative max-w-3xl mx-auto">
        <p class="text-teal-400 text-xs font-bold uppercase tracking-widest mb-4">One Piece Card Game</p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Yonko League
          <span class="block text-teal-400">Card Catalog</span>
        </h1>
        <p class="text-gray-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Browse, filter, and explore every card from the One Piece TCG.
          High-quality reference data for collectors and players.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/sets/op01" class="btn-primary text-base px-6 py-3">
            OP-01 Romance Dawn →
          </NuxtLink>
          <NuxtLink to="/cards" class="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-base text-white border border-white/20 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
            All Cards
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Sets -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-bold text-gray-900">Available Sets</h2>
      </div>
      <div v-if="setsPending" class="grid md:grid-cols-2 gap-4">
        <div v-for="n in 2" :key="n" class="h-36 bg-white rounded-xl border border-gray-200 animate-pulse" />
      </div>
      <div v-else-if="sets.length" class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CatalogSetSummary v-for="set in sortedSets" :key="set.id" :set="set" />
      </div>
      <p v-else class="text-gray-400">No sets available.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Yonko League — One Piece TCG Card Catalog',
  meta: [{ name: 'description', content: 'Browse every card from the One Piece TCG. Filter by color, type, rarity, and more. Yonko League card catalog.' }],
})

const { sets, pending: setsPending, fetchAll } = useSets()
await fetchAll()

const sortedSets = computed(() =>
  [...sets.value].sort((a, b) => {
    if (!a.release_date && !b.release_date) return 0
    if (!a.release_date) return 1
    if (!b.release_date) return -1
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  })
)
</script>
