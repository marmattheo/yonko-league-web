<template>
  <div class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
    <template v-if="card.card_cost !== null && card.card_type?.code !== 'DON'">
      <span><span class="text-gray-400 text-xs uppercase tracking-wide">Cost</span> <span class="text-gray-900 font-semibold">{{ card.card_cost }}</span></span>
    </template>

    <template v-if="card.card_power !== null">
      <span><span class="text-gray-400 text-xs uppercase tracking-wide">Pwr</span> <span class="text-gray-900 font-semibold">{{ card.card_power.toLocaleString() }}</span></span>
    </template>

    <template v-if="card.counter !== null">
      <span><span class="text-gray-400 text-xs uppercase tracking-wide">Ctr</span> <span class="text-gray-900 font-semibold">{{ card.counter > 0 ? '+' + card.counter : card.counter }}</span></span>
    </template>

    <template v-if="card.leader_life !== null && card.card_type?.code === 'LEADER'">
      <span><span class="text-gray-400 text-xs uppercase tracking-wide">Life</span> <span class="text-teal-700 font-semibold">{{ card.leader_life }}</span></span>
    </template>

    <template v-if="card.attribute">
      <span><span class="text-gray-400 text-xs uppercase tracking-wide">Attr</span> <span class="text-gray-900 font-semibold">{{ card.attribute.name }}</span></span>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types/catalog'

defineProps<{ card: Card }>()
</script>
