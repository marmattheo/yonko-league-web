<template>
  <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Loading skeleton -->
    <div v-if="setLoading" class="animate-pulse space-y-3 mb-6">
      <div class="h-7 bg-gray-100 rounded w-48" />
      <div class="h-4 bg-gray-100 rounded w-32" />
    </div>

    <template v-else-if="setDetail">
      <!-- Header + Filter side-by-side -->
      <div class="flex flex-col lg:flex-row gap-6 mb-6">

        <!-- Left: set info ~20% -->
        <div class="lg:w-[18%] shrink-0">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <NuxtLink to="/" class="hover:text-gray-700">Home</NuxtLink>
            <span>/</span>
            <NuxtLink to="/" class="hover:text-gray-700">Sets</NuxtLink>
            <span>/</span>
            <span class="text-gray-600">{{ setDetail.code }}</span>
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900 leading-tight">{{ setDetail.name }}</h1>
          <p class="text-gray-500 text-sm mt-1">
            <span class="font-semibold text-gray-800 mr-1">{{ setDetail.code }}</span>
            <span v-if="setDetail.release_date">· {{ formatDate(setDetail.release_date) }}</span>
          </p>

          <!-- Stats row -->
          <div class="flex flex-wrap gap-2 mt-4">
            <div class="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-center min-w-[70px]">
              <div class="text-xl font-bold text-teal-700">{{ setDetail.total_printings ?? setDetail.total_cards }}</div>
              <div class="text-xs text-gray-500 mt-0.5">Total Cards</div>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[70px]">
              <div class="text-xl font-bold text-gray-900">{{ setDetail.base_count }}</div>
              <div class="text-xs text-gray-500 mt-0.5">Normal</div>
            </div>
            <template v-if="setDetail.variant_counts">
              <div
                v-for="(count, code) in setDetail.variant_counts"
                :key="code"
                class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[70px]"
              >
                <div class="text-xl font-bold text-gray-900">{{ count }}</div>
                <div class="text-xs text-gray-500 mt-0.5 capitalize">{{ String(code).toLowerCase().replace('_', ' ') }}</div>
              </div>
            </template>
          </div>

          <!-- Result count -->
          <p v-if="result" class="text-gray-400 text-xs mt-3">{{ result.total.toLocaleString() }} cards shown</p>
        </div>

        <!-- Right: filters ~70% -->
        <div class="flex-1 min-w-0">
          <CatalogCardFilterBar
            :filters="activeFilters"
            :filter-options="filterOptions"
            :show-set-filter="false"
            :always-expanded="true"
            @update="updateFilters"
            @reset="resetFilters"
          />
        </div>
      </div>
    </template>

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
import type { CardFiltersState, CatalogSet } from '~/types/catalog'

const router = useRouter()
const route = useRoute()
const setCode = computed(() => String(route.params.setCode).toUpperCase())

const setDetail = ref<CatalogSet | null>(null)
const setLoading = ref(true)

useHead(() => ({
  title: setDetail.value ? `${setDetail.value.code} ${setDetail.value.name}` : `Set ${setCode.value}`,
  meta: [{
    name: 'description',
    content: setDetail.value
      ? `Browse all ${setDetail.value.total_cards} cards from ${setDetail.value.name} (${setDetail.value.code}) in the One Piece Card Game.`
      : '',
  }],
}))

const PER_PAGE = 48

function queryToFilters(q: typeof route.query): CardFiltersState {
  return {
    search:      String(q.search      || ''),
    set:         setCode.value,   // always locked to this set
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

// Redirect to ?language=EN if no language is set in the URL (default view)
if (!route.query.language) {
  await router.replace({ query: { ...route.query, language: 'EN' } })
}

const { result, pending, error, fetch } = useCatalogCards()
const { filters: filterOptions, fetch: fetchFilters } = useCatalogFilters()
const { fetchOne } = useSets()

const [setData] = await Promise.all([
  fetchOne(setCode.value),
  fetchFilters(),
  fetch(activeFilters.value),
])
setDetail.value = setData
setLoading.value = false

// Re-fetch when URL query changes (back/forward navigation)
watch(() => route.query, (newQ, oldQ) => {
  if (newQ.page !== oldQ.page) window.scrollTo({ top: 0, behavior: 'smooth' })
  fetch(activeFilters.value)
}, { deep: true })

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function updateFilters(partial: Partial<CardFiltersState>) {
  const next: Record<string, string> = {}
  const merged = { ...queryToFilters(route.query), ...partial }
  for (const [k, v] of Object.entries(merged)) {
    if (k === 'per_page' || k === 'set') continue  // set is in the route param, not query
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
