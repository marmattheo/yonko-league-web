<template>
  <div class="space-y-3">
    <!-- Effect text -->
    <div v-if="effectText" class="bg-gray-800 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Effect</span>
      </div>
      <p class="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{{ effectText }}</p>
    </div>

    <!-- Trigger text -->
    <div v-if="triggerText" class="bg-gray-800 border border-yellow-700/50 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-xs font-semibold text-yellow-500 uppercase tracking-wide">Trigger</span>
      </div>
      <p class="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{{ triggerText }}</p>
    </div>

    <!-- Structured effects -->
    <template v-if="effects?.length">
      <div
        v-for="effect in effects"
        :key="effect.id"
        class="bg-gray-800 rounded-lg p-3"
        :class="effect.is_trigger ? 'border border-yellow-700/50' : ''"
      >
        <div class="flex items-center gap-2 mb-1.5">
          <span
            v-if="effect.timing"
            class="text-xs font-semibold uppercase tracking-wide"
            :class="effect.is_trigger ? 'text-yellow-500' : 'text-blue-400'"
          >
            {{ effect.timing.name }}
          </span>
          <span v-if="effect.label_text" class="text-xs text-gray-500">{{ effect.label_text }}</span>
        </div>
        <p v-if="effect.effect_text" class="text-sm text-gray-200 leading-relaxed">{{ effect.effect_text }}</p>
        <p v-if="effect.cost_text" class="text-xs text-gray-400 mt-1">Cost: {{ effect.cost_text }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CardEffect } from '~/types/catalog'

defineProps<{
  effectText?: string | null
  triggerText?: string | null
  effects?: CardEffect[]
}>()
</script>
