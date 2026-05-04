<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar filters -->
      <aside class="lg:w-64 shrink-0">
        <div class="sticky top-20">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-white">Filters</h2>
            <!-- Mobile toggle -->
            <button
              class="lg:hidden text-sm text-gray-400 hover:text-white"
              @click="filtersOpen = !filtersOpen"
            >
              {{ filtersOpen ? 'Hide' : 'Show' }}
            </button>
          </div>
          <div :class="filtersOpen ? 'block' : 'hidden lg:block'">
            <CatalogCardFilters
              :filters="activeFilters"
              :filter-options="filterOptions"
              @update="updateFilters"
              @reset="resetFilters"
            />
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0">
        <!-- Toolbar -->
        <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 class="text-2xl font-bold text-white">All Cards</h1>
            <p v-if="result" class="text-gray-500 text-sm mt-0.5">
              {{ result.total.toLocaleString() }} cards
            </p>
          </div>
          <CatalogCardSort v-model="activeFilters.sort" @update:model-value="updateFilters({ sort: $event, page: 1 })" />
        </div>

        <!-- Active filter chips -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300"
          >
            {{ chip.label }}
            <button class="ml-1 text-gray-500 hover:text-white" @click="updateFilters({ [chip.key]: '', page: 1 })">✕</button>
          </span>
        </div>

        <!-- Card grid -->
        <CatalogCardGrid
          :cards="result?.data"
          :loading="pending"
          :error="error"
        />

        <!-- Pagination -->
        <div v-if="result && result.last_page > 1" class="flex items-center justify-center gap-2 mt-10">
          <button
            :disabled="result.current_page <= 1"
            class="btn-ghost px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            @click="updateFilters({ page: result!.current_page - 1 })"
          >
            ← Prev
          </button>
          <span class="text-gray-400 text-sm">
            Page {{ result.current_page }} of {{ result.last_page }}
          </span>
          <button
            :disabled="result.current_page >= result.last_page"
            class="btn-ghost px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            @click="updateFilters({ page: result!.current_page + 1 })"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardFiltersState } from '~/types/catalog'

useHead({ title: 'All Cards' })

const filtersOpen = ref(false)

const DEFAULT_FILTERS: CardFiltersState = {
  search: '', set: '', card_type: '', color: '', rarity: '',
  attribute: '', affiliation: '', variant: '',
  cost_min: '', cost_max: '', power_min: '', power_max: '',
  counter: '', leader_life: '', has_effect: '', has_trigger: '',
  sort: 'card_number_asc', page: 1, per_page: 48,
}

const activeFilters = reactive<CardFiltersState>({ ...DEFAULT_FILTERS })

const { result, pending, error, fetch } = useCatalogCards()
const { filters: filterOptions, fetch: fetchFilters } = useCatalogFilters()

await Promise.all([
  fetchFilters(),
  fetch(activeFilters),
])

const hasActiveFilters = computed(() =>
  !!(activeFilters.search || activeFilters.set || activeFilters.card_type ||
     activeFilters.color || activeFilters.rarity || activeFilters.attribute ||
     activeFilters.affiliation || activeFilters.variant || activeFilters.cost_min ||
     activeFilters.cost_max || activeFilters.power_min || activeFilters.power_max ||
     activeFilters.has_effect || activeFilters.has_trigger)
)

const activeFilterChips = computed(() => {
  const chips: { key: keyof CardFiltersState; label: string }[] = []
  if (activeFilters.search)     chips.push({ key: 'search',     label: `"${activeFilters.search}"` })
  if (activeFilters.set)        chips.push({ key: 'set',        label: `Set: ${activeFilters.set}` })
  if (activeFilters.card_type)  chips.push({ key: 'card_type',  label: `Type: ${activeFilters.card_type}` })
  if (activeFilters.color)      chips.push({ key: 'color',      label: `Color: ${activeFilters.color}` })
  if (activeFilters.rarity)     chips.push({ key: 'rarity',     label: `Rarity: ${activeFilters.rarity}` })
  if (activeFilters.attribute)  chips.push({ key: 'attribute',  label: `Attr: ${activeFilters.attribute}` })
  if (activeFilters.affiliation)chips.push({ key: 'affiliation',label: `Affil: ${activeFilters.affiliation}` })
  if (activeFilters.variant)    chips.push({ key: 'variant',    label: `Variant: ${activeFilters.variant}` })
  if (activeFilters.has_effect) chips.push({ key: 'has_effect', label: 'Has Effect' })
  if (activeFilters.has_trigger)chips.push({ key: 'has_trigger',label: 'Has Trigger' })
  return chips
})

function updateFilters(partial: Partial<CardFiltersState>) {
  Object.assign(activeFilters, partial)
  fetch(activeFilters)
}

function resetFilters() {
  Object.assign(activeFilters, { ...DEFAULT_FILTERS })
  fetch(activeFilters)
}
</script>
