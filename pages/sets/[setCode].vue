<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading state -->
    <div v-if="setLoading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-800 rounded w-48" />
      <div class="h-4 bg-gray-800 rounded w-32" />
    </div>

    <!-- Set header -->
    <template v-else-if="setDetail">
      <div class="mb-8">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div class="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
              <span>/</span>
              <span>Sets</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white">{{ setDetail.name }}</h1>
            <p class="text-gray-400 mt-1">
              <span class="font-mono text-gray-500 mr-2">{{ setDetail.code }}</span>
              <span v-if="setDetail.release_date">· {{ formatDate(setDetail.release_date) }}</span>
            </p>
          </div>
        </div>

        <!-- Set stats -->
        <div class="flex flex-wrap gap-4 mt-4">
          <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-center">
            <div class="text-2xl font-bold text-white">{{ setDetail.total_cards }}</div>
            <div class="text-xs text-gray-500 mt-0.5">Total Cards</div>
          </div>
          <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-center">
            <div class="text-2xl font-bold text-white">{{ setDetail.base_count }}</div>
            <div class="text-xs text-gray-500 mt-0.5">Base</div>
          </div>
          <template v-if="setDetail.variant_counts">
            <div
              v-for="(count, code) in setDetail.variant_counts"
              :key="code"
              class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-center"
            >
              <div class="text-2xl font-bold text-white">{{ count }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ String(code).replace('_', ' ') }}</div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- Filters + grid layout -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar -->
      <aside class="lg:w-64 shrink-0">
        <div class="sticky top-20">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-white">Filters</h2>
            <button class="lg:hidden text-sm text-gray-400 hover:text-white" @click="filtersOpen = !filtersOpen">
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

      <!-- Main -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <p v-if="result" class="text-gray-500 text-sm">
            {{ result.total.toLocaleString() }} cards
          </p>
          <CatalogCardSort v-model="activeFilters.sort" @update:model-value="updateFilters({ sort: $event, page: 1 })" />
        </div>

        <CatalogCardGrid
          :cards="result?.data"
          :loading="pending"
          :error="error"
        />

        <div v-if="result && result.last_page > 1" class="flex items-center justify-center gap-2 mt-10">
          <button
            :disabled="result.current_page <= 1"
            class="btn-ghost px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            @click="updateFilters({ page: result!.current_page - 1 })"
          >
            ← Prev
          </button>
          <span class="text-gray-400 text-sm">Page {{ result.current_page }} of {{ result.last_page }}</span>
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
import type { CardFiltersState, CatalogSet } from '~/types/catalog'

const route = useRoute()
const setCode = computed(() => String(route.params.setCode).toUpperCase())

useHead(() => ({
  title: setDetail.value ? `${setDetail.value.code} ${setDetail.value.name}` : `Set ${setCode.value}`,
  meta: [{
    name: 'description',
    content: setDetail.value
      ? `Browse all ${setDetail.value.total_cards} cards from ${setDetail.value.name} (${setDetail.value.code}) in the One Piece Card Game.`
      : '',
  }],
}))

const setDetail = ref<CatalogSet | null>(null)
const setLoading = ref(true)

const DEFAULT_FILTERS: CardFiltersState = {
  search: '', set: setCode.value, card_type: '', color: '', rarity: '',
  attribute: '', affiliation: '', variant: '',
  cost_min: '', cost_max: '', power_min: '', power_max: '',
  counter: '', leader_life: '', has_effect: '', has_trigger: '',
  sort: 'card_number_asc', page: 1, per_page: 48,
}

const activeFilters = reactive<CardFiltersState>({ ...DEFAULT_FILTERS })
const filtersOpen = ref(false)

const { result, pending, error, fetch } = useCatalogCards()
const { filters: filterOptions, fetch: fetchFilters } = useCatalogFilters()
const { fetchOne } = useSets()

const [setData] = await Promise.all([
  fetchOne(setCode.value),
  fetchFilters(),
  fetch(activeFilters),
])
setDetail.value = setData
setLoading.value = false

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function updateFilters(partial: Partial<CardFiltersState>) {
  Object.assign(activeFilters, partial)
  fetch(activeFilters)
}

function resetFilters() {
  Object.assign(activeFilters, { ...DEFAULT_FILTERS, set: setCode.value })
  fetch(activeFilters)
}
</script>
