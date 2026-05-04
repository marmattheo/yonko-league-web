<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black py-20 px-4 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-red-600 blur-3xl" />
        <div class="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-yellow-600 blur-3xl" />
      </div>
      <div class="relative max-w-3xl mx-auto">
        <p class="text-red-500 text-sm font-semibold uppercase tracking-widest mb-3">One Piece Card Game</p>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          Yonko League<br />
          <span class="text-red-400">Card Catalog</span>
        </h1>
        <p class="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Browse every card from the One Piece TCG. Filter by color, type, rarity, and more.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/sets/op01" class="btn-primary text-base px-6 py-3">
            OP-01 Romance Dawn
          </NuxtLink>
          <NuxtLink to="/cards" class="btn-ghost text-base px-6 py-3">
            All Cards
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Sets -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-xl font-bold text-white mb-6">Available Sets</h2>
      <div v-if="setsPending" class="grid md:grid-cols-2 gap-4">
        <div v-for="n in 2" :key="n" class="h-32 bg-gray-900 rounded-xl border border-gray-800 animate-pulse" />
      </div>
      <div v-else-if="sets.length" class="grid md:grid-cols-2 gap-4">
        <CatalogSetSummary v-for="set in sets" :key="set.id" :set="set" />
      </div>
      <p v-else class="text-gray-500">No sets available.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Card Catalog' })

const { sets, pending: setsPending, fetchAll } = useSets()
await fetchAll()
</script>
