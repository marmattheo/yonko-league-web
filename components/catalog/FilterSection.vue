<template>
  <div class="border-t border-gray-100">
    <button
      type="button"
      class="flex items-center justify-between w-full px-5 py-3.5 text-left group
             focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
      :aria-expanded="open"
      @click="emit('toggle')"
    >
      <span class="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
        {{ title }}
      </span>
      <svg
        class="w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-200 overflow-hidden"
      leave-active-class="transition-all duration-200 overflow-hidden"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[600px] opacity-100"
      leave-from-class="max-h-[600px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="open" class="px-5 pb-5">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; open: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>
