<template>
  <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 text-white font-bold text-lg hover:text-red-400 transition-colors">
          <span class="text-red-500 text-2xl">⚔</span>
          <span>Yonko League</span>
        </NuxtLink>

        <!-- Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/cards"
            class="text-sm text-gray-400 hover:text-white transition-colors"
            active-class="text-white"
          >
            All Cards
          </NuxtLink>
          <NuxtLink
            to="/sets/op01"
            class="text-sm text-gray-400 hover:text-white transition-colors"
            active-class="text-white"
          >
            OP-01
          </NuxtLink>
        </nav>

        <!-- Mobile menu -->
        <button
          class="md:hidden text-gray-400 hover:text-white"
          aria-label="Open menu"
          @click="menuOpen = !menuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile nav -->
      <div v-if="menuOpen" class="md:hidden pb-4 space-y-2">
        <NuxtLink to="/cards" class="block text-sm text-gray-300 hover:text-white py-2" @click="menuOpen = false">All Cards</NuxtLink>
        <NuxtLink to="/sets/op01" class="block text-sm text-gray-300 hover:text-white py-2" @click="menuOpen = false">OP-01 Romance Dawn</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
</script>
