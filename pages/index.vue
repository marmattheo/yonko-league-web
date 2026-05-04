<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="bg-white border-b border-gray-100 py-16 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <p class="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">One Piece Card Game</p>
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Yonko League<br />
          <span class="text-teal-700">Card Catalog</span>
        </h1>
        <p class="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Browse every card from the One Piece TCG. Filter by color, type, rarity, and more.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
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
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-lg font-bold text-gray-900 mb-5">Available Sets</h2>
      <div v-if="setsPending" class="grid md:grid-cols-2 gap-4">
        <div v-for="n in 2" :key="n" class="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
      </div>
      <div v-else-if="sets.length" class="grid md:grid-cols-2 gap-4">
        <CatalogSetSummary v-for="set in sets" :key="set.id" :set="set" />
      </div>
      <p v-else class="text-gray-400">No sets available.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Card Catalog' })

const { sets, pending: setsPending, fetchAll } = useSets()
await fetchAll()
</script>
