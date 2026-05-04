<template>
  <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800 group-hover:ring-2 ring-red-500 transition-all">
    <!-- Image -->
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      @error="imgError = true"
    />

    <!-- Placeholder when no image or error -->
    <div
      v-if="!src || imgError"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-800"
    >
      <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-gray-500 text-xs text-center px-2">No image</span>
    </div>

    <!-- Reference image badge -->
    <div
      v-if="isReference && src && !imgError"
      class="absolute bottom-1 left-1 right-1"
    >
      <span class="block text-center bg-black/70 text-gray-400 text-xs py-0.5 px-1 rounded">
        Reference image
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string | null | undefined
  alt: string
  isReference?: boolean
}>()

const imgError = ref(false)
</script>
