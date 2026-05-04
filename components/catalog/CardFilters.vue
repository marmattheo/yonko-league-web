<template>
  <div class="space-y-4">
    <!-- Search -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Search</label>
      <input
        :value="filters.search"
        type="search"
        placeholder="Card name or number…"
        class="input"
        @input="emit('update', { search: ($event.target as HTMLInputElement).value, page: 1 })"
      />
    </div>

    <!-- Set -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Set</label>
      <select
        :value="filters.set"
        class="select"
        @change="emit('update', { set: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Sets</option>
        <option v-for="s in filterOptions?.sets" :key="s.code" :value="s.code">
          {{ s.code }} — {{ s.name }}
        </option>
      </select>
    </div>

    <!-- Card type -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Type</label>
      <select :value="filters.card_type" class="select" @change="emit('update', { card_type: ($event.target as HTMLSelectElement).value, page: 1 })">
        <option value="">All Types</option>
        <option v-for="t in filterOptions?.card_types" :key="t.code" :value="t.code">{{ t.name }}</option>
      </select>
    </div>

    <!-- Color -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Color</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in filterOptions?.colors"
          :key="c.code"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all"
          :class="filters.color === c.code
            ? 'border-transparent text-white ring-2 ring-white/30'
            : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'"
          :style="filters.color === c.code ? { backgroundColor: c.hex } : {}"
          @click="emit('update', { color: filters.color === c.code ? '' : c.code, page: 1 })"
        >
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: c.hex }" />
          {{ c.name }}
        </button>
      </div>
    </div>

    <!-- Rarity -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Rarity</label>
      <select :value="filters.rarity" class="select" @change="emit('update', { rarity: ($event.target as HTMLSelectElement).value, page: 1 })">
        <option value="">All Rarities</option>
        <option v-for="r in filterOptions?.rarities" :key="r.code" :value="r.code">{{ r.name }} ({{ r.code }})</option>
      </select>
    </div>

    <!-- Attribute -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Attribute</label>
      <select :value="filters.attribute" class="select" @change="emit('update', { attribute: ($event.target as HTMLSelectElement).value, page: 1 })">
        <option value="">All Attributes</option>
        <option v-for="a in filterOptions?.attributes" :key="a.code" :value="a.code">{{ a.name }}</option>
      </select>
    </div>

    <!-- Affiliation -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Affiliation</label>
      <select :value="filters.affiliation" class="select" @change="emit('update', { affiliation: ($event.target as HTMLSelectElement).value, page: 1 })">
        <option value="">All Affiliations</option>
        <option v-for="a in filterOptions?.affiliations" :key="a.code" :value="a.code">{{ a.name }}</option>
      </select>
    </div>

    <!-- Variant type -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Variant</label>
      <select :value="filters.variant" class="select" @change="emit('update', { variant: ($event.target as HTMLSelectElement).value, page: 1 })">
        <option value="">All Variants</option>
        <option v-for="v in filterOptions?.variant_types" :key="v.code" :value="v.code">{{ v.name }}</option>
      </select>
    </div>

    <!-- Cost range -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Cost</label>
      <div class="flex gap-2">
        <input :value="filters.cost_min" type="number" min="0" placeholder="Min" class="input" @input="emit('update', { cost_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <input :value="filters.cost_max" type="number" min="0" placeholder="Max" class="input" @input="emit('update', { cost_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>
    </div>

    <!-- Power range -->
    <div>
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Power</label>
      <div class="flex gap-2">
        <input :value="filters.power_min" type="number" step="1000" placeholder="Min" class="input" @input="emit('update', { power_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <input :value="filters.power_max" type="number" step="1000" placeholder="Max" class="input" @input="emit('update', { power_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>
    </div>

    <!-- Has effect / trigger -->
    <div class="space-y-2">
      <label class="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Contains</label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          :checked="filters.has_effect === '1'"
          class="rounded border-gray-600 bg-gray-800 text-red-500"
          @change="emit('update', { has_effect: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })"
        />
        <span class="text-sm text-gray-300">Has effect</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          :checked="filters.has_trigger === '1'"
          class="rounded border-gray-600 bg-gray-800 text-red-500"
          @change="emit('update', { has_trigger: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })"
        />
        <span class="text-sm text-gray-300">Has trigger</span>
      </label>
    </div>

    <!-- Reset button -->
    <button class="btn-ghost w-full text-sm" @click="emit('reset')">
      Reset all filters
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CardFiltersState, CatalogFilters } from '~/types/catalog'

defineProps<{
  filters: CardFiltersState
  filterOptions: CatalogFilters | null
}>()

const emit = defineEmits<{
  update: [partial: Partial<CardFiltersState>]
  reset: []
}>()
</script>
