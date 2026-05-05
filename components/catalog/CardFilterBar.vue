<template>
  <div class="bg-white border border-gray-200 rounded-xl p-3 mb-6 space-y-2.5">
    <!-- Filter rows — all expanded when alwaysExpanded, otherwise primary + collapsible advanced -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search -->
      <div class="flex-1 min-w-[160px]">
        <input
          :value="searchInput"
          type="search"
          placeholder="Search name or number…"
          class="input h-9 text-sm"
          @input="onSearchInput(($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Set (hidden on set-scoped pages) -->
      <select
        v-if="showSet && filterOptions?.sets?.length"
        :value="filters.set"
        class="filter-select"
        @change="emit('update', { set: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Sets</option>
        <option v-for="s in filterOptions.sets" :key="s.code" :value="s.code">{{ s.code }}</option>
      </select>

      <!-- Type -->
      <select
        :value="filters.card_type"
        class="filter-select"
        @change="emit('update', { card_type: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Types</option>
        <option v-for="t in filterOptions?.card_types" :key="t.code" :value="t.code">{{ t.name }}</option>
      </select>

      <!-- Color -->
      <select
        :value="filters.color"
        class="filter-select"
        @change="emit('update', { color: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Colors</option>
        <option v-for="c in filterOptions?.colors" :key="c.code" :value="c.code">{{ c.name }}</option>
      </select>

      <!-- Rarity -->
      <select
        :value="filters.rarity"
        class="filter-select"
        @change="emit('update', { rarity: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Rarities</option>
        <option v-for="r in filterOptions?.rarities" :key="r.code" :value="r.code">{{ r.name }}</option>
      </select>

      <!-- Variant -->
      <select
        :value="filters.variant"
        class="filter-select"
        @change="emit('update', { variant: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Variants</option>
        <option value="NORMAL">Normal</option>
        <option value="PARALLEL">Parallel / Alt Art</option>
      </select>

      <!-- Counter -->
      <select
        :value="filters.counter"
        class="filter-select"
        @change="emit('update', { counter: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">Counter</option>
        <option value="1000">1000</option>
        <option value="2000">2000</option>
      </select>

      <!-- Advanced filters inline when alwaysExpanded -->
      <template v-if="alwaysExpanded">
        <div class="w-px h-6 bg-gray-200" />

        <select
          :value="filters.attribute"
          class="filter-select"
          @change="emit('update', { attribute: ($event.target as HTMLSelectElement).value, page: 1 })"
        >
          <option value="">All Attributes</option>
          <option v-for="a in filterOptions?.attributes" :key="a.code" :value="a.code">{{ a.name }}</option>
        </select>

        <select
          :value="filters.affiliation"
          class="filter-select"
          @change="emit('update', { affiliation: ($event.target as HTMLSelectElement).value, page: 1 })"
        >
          <option value="">All Affiliations</option>
          <option v-for="a in filterOptions?.affiliations" :key="a.code" :value="a.code">{{ a.name }}</option>
        </select>

        <select
          :value="filters.language"
          class="filter-select"
          @change="emit('update', { language: ($event.target as HTMLSelectElement).value, page: 1 })"
        >
          <option value="">All Languages</option>
          <option v-for="l in filterOptions?.languages" :key="l.code" :value="l.code">{{ l.name }}</option>
        </select>
      </template>

      <!-- Divider -->
      <div class="hidden sm:block w-px h-6 bg-gray-200" />

      <!-- Sort -->
      <select
        :value="filters.sort"
        class="filter-select"
        @change="emit('update', { sort: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="card_number_asc">Number ↑</option>
        <option value="card_number_desc">Number ↓</option>
        <option value="name_asc">Name A–Z</option>
        <option value="name_desc">Name Z–A</option>
        <option value="rarity_asc">Rarity ↑</option>
        <option value="rarity_desc">Rarity ↓</option>
        <option value="cost_asc">Cost ↑</option>
        <option value="cost_desc">Cost ↓</option>
      </select>

      <!-- More toggle (only when not alwaysExpanded) -->
      <button
        v-if="!alwaysExpanded"
        class="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
        :class="showAdvanced ? 'bg-gray-100 border-gray-300' : ''"
        @click="showAdvanced = !showAdvanced"
      >
        More
        <svg class="w-3.5 h-3.5 transition-transform" :class="showAdvanced ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Reset -->
      <button
        v-if="hasActiveFilters"
        class="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        @click="emit('reset')"
      >
        Reset
      </button>
    </div>

    <!-- Collapsible advanced row (only when NOT alwaysExpanded) -->
    <div v-if="!alwaysExpanded && showAdvanced" class="flex flex-wrap items-end gap-2 pt-2 border-t border-gray-100">
      <!-- Attribute -->
      <select
        :value="filters.attribute"
        class="filter-select"
        @change="emit('update', { attribute: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Attributes</option>
        <option v-for="a in filterOptions?.attributes" :key="a.code" :value="a.code">{{ a.name }}</option>
      </select>

      <!-- Affiliation -->
      <select
        :value="filters.affiliation"
        class="filter-select"
        @change="emit('update', { affiliation: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Affiliations</option>
        <option v-for="a in filterOptions?.affiliations" :key="a.code" :value="a.code">{{ a.name }}</option>
      </select>

      <!-- Language -->
      <select
        :value="filters.language"
        class="filter-select"
        @change="emit('update', { language: ($event.target as HTMLSelectElement).value, page: 1 })"
      >
        <option value="">All Languages</option>
        <option v-for="l in filterOptions?.languages" :key="l.code" :value="l.code">{{ l.name }}</option>
      </select>

      <!-- Cost range -->
      <div class="flex items-center gap-1">
        <span class="text-xs text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">Cost</span>
        <input :value="filters.cost_min" type="number" min="0" placeholder="Min" class="input h-9 text-sm w-16"
          @input="emit('update', { cost_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <span class="text-gray-300">–</span>
        <input :value="filters.cost_max" type="number" min="0" placeholder="Max" class="input h-9 text-sm w-16"
          @input="emit('update', { cost_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>

      <!-- Power range -->
      <div class="flex items-center gap-1">
        <span class="text-xs text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">Power</span>
        <input :value="filters.power_min" type="number" step="1000" placeholder="Min" class="input h-9 text-sm w-20"
          @input="emit('update', { power_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <span class="text-gray-300">–</span>
        <input :value="filters.power_max" type="number" step="1000" placeholder="Max" class="input h-9 text-sm w-20"
          @input="emit('update', { power_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>

      <!-- Checkboxes -->
      <label class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 whitespace-nowrap">
        <input type="checkbox" :checked="filters.has_effect === '1'"
          class="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          @change="emit('update', { has_effect: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
        Has effect
      </label>
      <label class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 whitespace-nowrap">
        <input type="checkbox" :checked="filters.has_trigger === '1'"
          class="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          @change="emit('update', { has_trigger: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
        Has trigger
      </label>
    </div>

    <!-- Also show cost/power/checkboxes in a second row when alwaysExpanded -->
    <div v-if="alwaysExpanded" class="flex flex-wrap items-end gap-2 pt-2 border-t border-gray-100">
      <div class="flex items-center gap-1">
        <span class="text-xs text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">Cost</span>
        <input :value="filters.cost_min" type="number" min="0" placeholder="Min" class="input h-9 text-sm w-16"
          @input="emit('update', { cost_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <span class="text-gray-300">–</span>
        <input :value="filters.cost_max" type="number" min="0" placeholder="Max" class="input h-9 text-sm w-16"
          @input="emit('update', { cost_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>
      <div class="flex items-center gap-1">
        <span class="text-xs text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">Power</span>
        <input :value="filters.power_min" type="number" step="1000" placeholder="Min" class="input h-9 text-sm w-20"
          @input="emit('update', { power_min: ($event.target as HTMLInputElement).value, page: 1 })" />
        <span class="text-gray-300">–</span>
        <input :value="filters.power_max" type="number" step="1000" placeholder="Max" class="input h-9 text-sm w-20"
          @input="emit('update', { power_max: ($event.target as HTMLInputElement).value, page: 1 })" />
      </div>
      <label class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 whitespace-nowrap">
        <input type="checkbox" :checked="filters.has_effect === '1'"
          class="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          @change="emit('update', { has_effect: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
        Has effect
      </label>
      <label class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 whitespace-nowrap">
        <input type="checkbox" :checked="filters.has_trigger === '1'"
          class="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          @change="emit('update', { has_trigger: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
        Has trigger
      </label>
    </div>

    <!-- Active filter chips -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-1.5 pt-1">
      <span
        v-for="chip in activeChips"
        :key="chip.key"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full text-xs text-teal-700"
      >
        {{ chip.label }}
        <button class="ml-0.5 cursor-pointer hover:text-teal-900" @click="clearChip(chip.key)">✕</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardFiltersState, CatalogFilters } from '~/types/catalog'

const props = defineProps<{
  filters: CardFiltersState
  filterOptions: CatalogFilters | null
  showSetFilter?: boolean
  alwaysExpanded?: boolean
}>()

const showSet = computed(() => props.showSetFilter !== false)

const emit = defineEmits<{
  update: [partial: Partial<CardFiltersState>]
  reset: []
}>()

// Debounced search — local input ref synced from props, emits after 350ms pause
const searchInput = ref(props.filters.search)
watch(() => props.filters.search, v => { searchInput.value = v })
let searchTimer: ReturnType<typeof setTimeout> | null = null
function onSearchInput(value: string) {
  searchInput.value = value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => emit('update', { search: value, page: 1 }), 350)
}

const showAdvanced = ref(false)

const hasActiveFilters = computed(() =>
  !!(props.filters.search || (showSet.value && props.filters.set) || props.filters.card_type ||
     props.filters.color || props.filters.rarity || props.filters.attribute ||
     props.filters.affiliation || props.filters.variant || props.filters.counter || props.filters.language ||
     props.filters.cost_min || props.filters.cost_max ||
     props.filters.power_min || props.filters.power_max ||
     props.filters.has_effect || props.filters.has_trigger)
)

const activeChips = computed(() => {
  const f = props.filters
  const chips: { key: keyof CardFiltersState; label: string }[] = []
  if (f.search)                     chips.push({ key: 'search',      label: `"${f.search}"` })
  if (f.set && showSet.value)       chips.push({ key: 'set',          label: `Set: ${f.set}` })
  if (f.card_type)                  chips.push({ key: 'card_type',    label: `Type: ${f.card_type}` })
  if (f.color)                      chips.push({ key: 'color',        label: `Color: ${f.color}` })
  if (f.rarity)                     chips.push({ key: 'rarity',       label: `Rarity: ${f.rarity}` })
  if (f.attribute)                  chips.push({ key: 'attribute',    label: `Attr: ${f.attribute}` })
  if (f.affiliation)                chips.push({ key: 'affiliation',  label: `Affil: ${f.affiliation}` })
  if (f.variant)                    chips.push({ key: 'variant',      label: `Variant: ${f.variant}` })
  if (f.counter)                    chips.push({ key: 'counter',      label: `Counter: ${f.counter}` })
  if (f.language) {
    const langName = props.filterOptions?.languages?.find(l => l.code === f.language)?.name ?? f.language
    chips.push({ key: 'language', label: `Lang: ${langName}` })
  }
  if (f.has_effect)  chips.push({ key: 'has_effect',   label: 'Has Effect' })
  if (f.has_trigger) chips.push({ key: 'has_trigger',  label: 'Has Trigger' })
  return chips
})

function clearChip(key: keyof CardFiltersState) {
  emit('update', { [key]: key === 'page' ? 1 : '', page: 1 } as any)
}
</script>

<style scoped>
.filter-select {
  @apply h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer;
}
</style>
