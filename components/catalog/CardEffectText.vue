<template>
  <div class="space-y-3">
    <!-- Effect text -->
    <div v-if="effectText" class="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Effect</span>
      </div>
      <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ effectText }}</p>
    </div>

    <!-- Trigger text -->
    <div v-if="triggerText" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-xs font-semibold text-amber-600 uppercase tracking-wide">Trigger</span>
      </div>
      <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ triggerText }}</p>
    </div>

    <!-- Structured effects -->
    <template v-if="effects?.length">
      <div
        v-for="effect in effects"
        :key="effect.id"
        class="rounded-lg p-3 border"
        :class="effect.is_trigger ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'"
      >
        <div class="flex items-center gap-2 mb-1.5">
          <span
            v-if="effect.timing"
            class="text-xs font-semibold uppercase tracking-wide"
            :class="effect.is_trigger ? 'text-amber-600' : 'text-teal-600'"
          >
            {{ effect.timing.name }}
          </span>
          <span v-if="effect.label_text" class="text-xs text-gray-400">{{ effect.label_text }}</span>
        </div>
        <p v-if="effect.effect_text" class="text-sm text-gray-800 leading-relaxed">{{ effect.effect_text }}</p>
        <p v-if="effect.cost_text" class="text-xs text-gray-500 mt-1">Cost: {{ effect.cost_text }}</p>
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
