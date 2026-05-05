<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      v-for="printing in printings"
      :key="printing.id"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all"
      :class="selected?.id === printing.id
        ? 'border-teal-600 bg-teal-50 text-teal-700'
        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400 hover:text-gray-900'"
      @click="emit('select', printing)"
    >
      <!-- Language badge -->
      <span
        v-if="printing.language"
        class="px-1.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600"
      >
        {{ languageLabel(printing.language) }}
      </span>

      <!-- Variant label -->
      <span>{{ variantLabel(printing) }}</span>

      <!-- Finish tags -->
      <span v-if="printing.finishes?.length" class="text-gray-400">
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
  const code = p.variant_type?.code
  if (code === 'MANGA') return 'Manga'
  if (code === 'SP_CARD') return 'SP'
  if (code === 'ALT_ART') return 'Alt Art'
  if (code === 'PARALLEL') return 'Parallel'
  return 'Base'
}

function languageLabel(lang: { code: string; name?: string }): string {
  // Use short friendly labels
  const shorts: Record<string, string> = { ZH_HANS: 'SC', ZH_HANT: 'TC' }
  return shorts[lang.code] ?? lang.code
}
</script>
