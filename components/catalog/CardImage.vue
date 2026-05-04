<template>
  <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-100">
    <!-- Primary image (R2 CDN) -->
    <img
      v-if="src && !r2Error"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      loading="lazy"
      @error="r2Error = true"
    />

    <!-- Fallback: official One Piece card game image -->
    <img
      v-else-if="fallbackSrc && !fallbackError"
      :src="fallbackSrc"
      :alt="alt"
      class="w-full h-full object-cover"
      loading="lazy"
      @error="fallbackError = true"
    />

    <!-- Placeholder when both fail -->
    <div
      v-if="(!src || r2Error) && (!fallbackSrc || fallbackError)"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100"
    >
      <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-gray-400 text-xs text-center px-2">No image</span>
    </div>

    <!-- Reference image badge -->
    <div
      v-if="isReference && (src && !r2Error || fallbackSrc && !fallbackError)"
      class="absolute bottom-1 left-1 right-1"
    >
      <span class="block text-center bg-black/50 text-white text-xs py-0.5 px-1 rounded">
        Reference image
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string | null | undefined
  alt: string
  fallbackSrc?: string | null
  isReference?: boolean
}>()

const r2Error = ref(false)
const fallbackError = ref(false)
</script>
