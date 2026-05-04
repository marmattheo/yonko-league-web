<template>
  <div class="flex flex-wrap gap-1">
    <!-- Colors -->
    <template v-if="colors?.length">
      <span
        v-for="color in colors"
        :key="color.code"
        class="card-badge text-white text-xs font-semibold"
        :style="{ backgroundColor: color.hex }"
      >
        {{ color.name }}
      </span>
    </template>

    <!-- Card type -->
    <span
      v-if="cardType"
      class="card-badge"
      :class="cardTypeClass(cardType.code)"
    >
      {{ cardType.name }}
    </span>

    <!-- Rarity -->
    <span
      v-if="rarity"
      class="card-badge bg-gray-700 text-gray-200"
    >
      {{ rarity.code }}
    </span>

    <!-- Variant type badge -->
    <span
      v-if="variantType && variantType.code !== 'NORMAL'"
      class="card-badge"
      :class="variantClass(variantType.code)"
    >
      {{ variantType.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Color, CardType, Rarity, VariantType } from '~/types/catalog'

defineProps<{
  colors?: Color[]
  cardType?: CardType | null
  rarity?: Rarity | null
  variantType?: VariantType | null
}>()

function cardTypeClass(code: string): string {
  const map: Record<string, string> = {
    LEADER:    'bg-yellow-600 text-yellow-100',
    CHARACTER: 'bg-blue-700 text-blue-100',
    EVENT:     'bg-purple-700 text-purple-100',
    STAGE:     'bg-green-700 text-green-100',
    DON:       'bg-red-700 text-red-100',
  }
  return map[code] ?? 'bg-gray-700 text-gray-200'
}

function variantClass(code: string): string {
  const map: Record<string, string> = {
    PARALLEL:  'bg-indigo-600 text-indigo-100',
    MANGA:     'bg-orange-600 text-orange-100',
    SP_CARD:   'bg-pink-600 text-pink-100',
    ALT_ART:   'bg-teal-600 text-teal-100',
    SIGNATURE: 'bg-amber-600 text-amber-100',
  }
  return map[code] ?? 'bg-gray-600 text-gray-200'
}
</script>
