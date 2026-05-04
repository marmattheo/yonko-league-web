<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      v-for="printing in printings"
      :key="printing.id"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all"
      :class="selected?.id === printing.id
        ? 'border-red-500 bg-red-500/10 text-white'
        : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'"
      @click="emit('select', printing)"
    >
      <!-- Language badge -->
      <span
        v-if="printing.language"
        class="px-1.5 py-0.5 rounded text-xs font-bold bg-gray-700 text-gray-300"
      >
        {{ printing.language.code }}
      </span>

      <!-- Variant label -->
      <span>{{ variantLabel(printing) }}</span>

      <!-- Finish tags -->
      <span v-if="printing.finishes?.length" class="text-gray-500">
        · {{ printing.finishes.map(f => f.code).join('/') }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CardPrinting } from '~/types/catalog'

defineProps<{
  printings: CardPrinting[]
  selected: CardPrinting | null
}>()

const emit = defineEmits<{ select: [printing: CardPrinting] }>()

function variantLabel(p: CardPrinting): string {
  if (p.is_promo) return 'Promo'
  if (p.is_parallel) return 'Parallel'
  return 'Base'
}
</script>
