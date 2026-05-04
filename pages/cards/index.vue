<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page header -->
    <div class="mb-5">
      <h1 class="text-2xl font-bold text-gray-900">All Cards</h1>
      <p v-if="result" class="text-gray-500 text-sm mt-0.5">{{ result.total.toLocaleString() }} cards</p>
    </div>

    <!-- Horizontal filter bar -->
    <CatalogCardFilterBar
      :filters="activeFilters"
      :filter-options="filterOptions"
      @update="updateFilters"
      @reset="resetFilters"
    />

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
      <span class="text-gray-500 text-sm">Page {{ result.current_page }} of {{ result.last_page }}</span>
      <button
        :disabled="result.current_page >= result.last_page"
        class="btn-ghost px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        @click="updateFilters({ page: result!.current_page + 1 })"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardFiltersState } from '~/types/catalog'

useHead({ title: 'All Cards' })

const router = useRouter()
const route = useRoute()

const PER_PAGE = 48

function queryToFilters(q: typeof route.query): CardFiltersState {
  return {
    search:      String(q.search      || ''),
    set:         String(q.set         || ''),
    card_type:   String(q.card_type   || ''),
    color:       String(q.color       || ''),
    rarity:      String(q.rarity      || ''),
    attribute:   String(q.attribute   || ''),
    affiliation: String(q.affiliation || ''),
    variant:     String(q.variant     || ''),
    language:    String(q.language    || ''),
    cost_min:    String(q.cost_min    || ''),
    cost_max:    String(q.cost_max    || ''),
    power_min:   String(q.power_min   || ''),
    power_max:   String(q.power_max   || ''),
    counter:     String(q.counter     || ''),
    leader_life: String(q.leader_life || ''),
    has_effect:  String(q.has_effect  || ''),
    has_trigger: String(q.has_trigger || ''),
    sort:        String(q.sort        || 'card_number_asc'),
    page:        Number(q.page        || 1),
    per_page:    PER_PAGE,
  }
}

const activeFilters = computed(() => queryToFilters(route.query))

// Redirect to ?language=EN if no language in URL (default view, avoids duplicates)
if (!route.query.language) {
  await router.replace({ query: { ...route.query, language: 'EN' } })
}

const { result, pending, error, fetch } = useCatalogCards()
const { filters: filterOptions, fetch: fetchFilters } = useCatalogFilters()

await Promise.all([
  fetchFilters(),
  fetch(activeFilters.value),
])

// Re-fetch when URL query changes (back/forward navigation)
watch(() => route.query, (newQ, oldQ) => {
  if (newQ.page !== oldQ.page) window.scrollTo({ top: 0, behavior: 'smooth' })
  fetch(activeFilters.value)
}, { deep: true })

function updateFilters(partial: Partial<CardFiltersState>) {
  const next: Record<string, string> = {}
  const merged = { ...queryToFilters(route.query), ...partial }
  for (const [k, v] of Object.entries(merged)) {
    if (k === 'per_page') continue
    if (v === '' || v === null || v === undefined) continue
    if (k === 'page' && Number(v) === 1) continue
    if (k === 'sort' && v === 'card_number_asc') continue
    next[k] = String(v)
  }
  router.replace({ query: next })
}

function resetFilters() {
  router.replace({ query: { language: 'EN' } })
}
</script>


