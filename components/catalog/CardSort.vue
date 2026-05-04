<template>
  <div class="flex items-center gap-2">
    <label class="text-xs text-gray-500 font-semibold uppercase tracking-wide shrink-0">Sort</label>
    <select
      :value="modelValue"
      class="select text-sm"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="card_number_asc">Card Number ↑</option>
      <option value="name_asc">Name A–Z</option>
      <option value="name_desc">Name Z–A</option>
      <option value="rarity_asc">Rarity</option>
      <option value="cost_asc">Cost ↑</option>
      <option value="cost_desc">Cost ↓</option>
      <option value="power_asc">Power ↑</option>
      <option value="power_desc">Power ↓</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
