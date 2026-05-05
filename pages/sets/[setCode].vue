<template>
  <div class="mx-auto py-6" style="max-width: 1536px; padding-left: 28px; padding-right: 28px;">

    <!-- Set header -->
    <div v-if="setLoading" class="animate-pulse mb-6">
      <div class="h-7 bg-gray-100 rounded w-48 mb-2" />
      <div class="h-4 bg-gray-100 rounded w-32" />
    </div>

    <template v-else-if="setDetail">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
        <NuxtLink to="/" class="hover:text-gray-700 transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-600 font-medium">{{ setDetail.code }}</span>
      </div>

      <!-- Set title + stats bar -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-mono">
                {{ setDetail.code }}
              </span>
              <span v-if="setDetail.release_date" class="text-xs text-gray-400">
                {{ formatDate(setDetail.release_date) }}
              </span>
            </div>
            <h1 class="text-2xl font-extrabold text-gray-900 mt-1.5 leading-tight">{{ setDetail.name }}</h1>
            <p v-if="result" class="text-gray-400 text-xs mt-1">
              Showing {{ result.total.toLocaleString() }} cards
            </p>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-2 shrink-0">
            <div class="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-center min-w-[64px]">
              <div class="text-xl font-bold text-teal-700">{{ setDetail.total_printings ?? setDetail.total_cards }}</div>
              <div class="text-xs text-teal-600 mt-0.5">Total</div>
            </div>
            <template v-if="setDetail.variant_counts">
              <div v-if="setDetail.variant_counts.base" class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[64px]">
                <div class="text-xl font-bold text-gray-900">{{ setDetail.variant_counts.base }}</div>
                <div class="text-xs text-gray-500 mt-0.5">Base</div>
              </div>
              <div v-if="setDetail.variant_counts.alt_art" class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[64px]">
                <div class="text-xl font-bold text-gray-900">{{ setDetail.variant_counts.alt_art }}</div>
                <div class="text-xs text-gray-500 mt-0.5">Alt Art</div>
              </div>
              <div v-if="setDetail.variant_counts.manga" class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[64px]">
                <div class="text-xl font-bold text-gray-900">{{ setDetail.variant_counts.manga }}</div>
                <div class="text-xs text-gray-500 mt-0.5">Manga</div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Sidebar + grid layout -->
      <div class="flex items-start" style="gap: 28px;">
        <!-- Desktop sidebar — 340px fixed -->
        <aside
          class="hidden lg:block shrink-0 sticky sidebar-scroll"
          style="width: 340px; min-width: 340px; max-width: 360px; top: 80px; max-height: calc(100vh - 112px); overflow-y: auto; padding-bottom: 24px;"
          aria-label="Filter panel"
        >
          <CatalogCardFiltersDesktop
            :filters="activeFilters"
            :filter-options="filterOptions"
            :show-set-filter="false"
            @update="updateFilters"
            @reset="resetFilters"
          />
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Mobile: filter button -->
          <div class="flex items-center justify-between mb-4 lg:hidden">
            <span class="text-sm text-gray-500">
              <template v-if="result">{{ result.total.toLocaleString() }} cards</template>
            </span>
            <button
              class="inline-flex items-center gap-2 btn-ghost text-sm"
              @click="mobileFiltersOpen = true"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              <span
                v-if="activeFilterCount > 0"
                class="bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none"
              >{{ activeFilterCount }}</span>
            </button>
          </div>

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
            >← Prev</button>
            <span class="text-gray-500 text-sm">Page {{ result.current_page }} of {{ result.last_page }}</span>
            <button
              :disabled="result.current_page >= result.last_page"
              class="btn-ghost px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              @click="updateFilters({ page: result!.current_page + 1 })"
            >Next →</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Set not found -->
    <div v-else-if="!setLoading" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p class="text-gray-700 font-semibold">Set not found</p>
      <NuxtLink to="/" class="btn-ghost text-sm">← Back to Home</NuxtLink>
    </div>
  </div>

  <!-- Mobile filter drawer -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileFiltersOpen" class="lg:hidden" style="position:fixed;inset:0;z-index:50;">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);" @click="mobileFiltersOpen = false" />
        <div style="position:absolute;left:0;top:0;height:100%;width:340px;max-width:92vw;background:#fff;box-shadow:4px 0 24px rgba(0,0,0,0.15);display:flex;flex-direction:column;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #f3f4f6;flex-shrink:0;background:#f0f4f8;">
            <h2 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Filters</h2>
            <button
              style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid #e5e7eb;background:white;color:#6b7280;cursor:pointer;"
              aria-label="Close filters"
              @click="mobileFiltersOpen = false"
            >
              <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div style="flex:1;overflow-y:auto;" class="sidebar-scroll">
            <CatalogCardFilters
              :filters="activeFilters"
              :filter-options="filterOptions"
              :show-set-filter="false"
              @update="updateFilters"
              @reset="() => { resetFilters(); mobileFiltersOpen = false }"
            />
          </div>
          <div style="padding:14px 20px;border-top:1px solid #f3f4f6;flex-shrink:0;">
            <button
              style="width:100%;height:44px;background:#0d9488;color:white;font-size:15px;font-weight:600;border:none;border-radius:10px;cursor:pointer;"
              @click="mobileFiltersOpen = false"
            >Show Results</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CardFiltersState, CatalogSet } from '~/types/catalog'

const router = useRouter()
const route = useRoute()
const setCode = computed(() => String(route.params.setCode).toUpperCase())
const mobileFiltersOpen = ref(false)
const { userClearedLanguage } = useCatalogSession()

const setDetail = ref<CatalogSet | null>(null)
const setLoading = ref(true)

useHead(() => ({
  title: setDetail.value ? `${setDetail.value.code} ${setDetail.value.name} — Yonko League` : `Set ${setCode.value}`,
  meta: [{
    name: 'description',
    content: setDetail.value
      ? `Browse all ${setDetail.value.total_printings ?? setDetail.value.total_cards} cards from ${setDetail.value.name} (${setDetail.value.code}) in the One Piece Card Game.`
      : '',
  }],
}))

const PER_PAGE = 48

function queryToFilters(q: typeof route.query): CardFiltersState {
  return {
    search:      String(q.search      || ''),
    set:         setCode.value,
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

const activeFilters = computed(() => {
  const f = queryToFilters(route.query)
  return f
})

// On mount: write the EN default to the URL if no language is set and the user
// hasn't explicitly cleared it this session.
onMounted(() => {
  if (!route.query.language && !userClearedLanguage.value) {
    router.replace({ query: { ...route.query, language: 'EN' } })
  }
})

const activeFilterCount = computed(() => {
  const f = activeFilters.value
  return [f.search, f.card_type, f.color, f.rarity, f.attribute,
    f.affiliation, f.variant, f.counter, f.language,
    f.cost_min, f.cost_max, f.power_min, f.power_max,
    f.has_effect, f.has_trigger,
  ].filter(Boolean).length
})

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

watch(() => route.query, (newQ, oldQ) => {
  if (newQ.page !== oldQ.page) window.scrollTo({ top: 0, behavior: 'smooth' })
  fetch(activeFilters.value)
}, { deep: true })

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function updateFilters(partial: Partial<CardFiltersState>) {
  if ('language' in partial && (partial.language === '' || partial.language === null || partial.language === undefined)) {
    userClearedLanguage.value = true
  } else if ('language' in partial && partial.language) {
    userClearedLanguage.value = false
  }

  const next: Record<string, string> = {}
  const merged = { ...queryToFilters(route.query), ...partial }
  for (const [k, v] of Object.entries(merged)) {
    if (k === 'per_page' || k === 'set') continue
    if (v === '' || v === null || v === undefined) continue
    if (k === 'page' && Number(v) === 1) continue
    if (k === 'sort' && v === 'card_number_asc') continue
    next[k] = String(v)
  }
  router.replace({ query: next })
}

function resetFilters() {
  userClearedLanguage.value = false
  router.replace({ query: { language: 'EN' } })
}
</script>
