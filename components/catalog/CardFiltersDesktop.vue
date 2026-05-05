<template>
  <div class="filter-panel">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <div class="filter-panel-header">
      <h2 class="filter-panel-title">Filters</h2>
      <button class="reset-all-btn" @click="emit('reset')">Reset all</button>
    </div>

    <!-- ── Always-visible: Search + Sort ──────────────────────── -->
    <div class="filter-body">

      <div class="filter-field">
        <label class="field-label">Search</label>
        <div class="search-wrap">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
          </svg>
          <input
            :value="searchInput"
            type="search"
            placeholder="Name or card number…"
            class="filter-input search-input"
            @input="onSearchInput(($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <div class="filter-field">
        <label class="field-label">Sort By</label>
        <select
          :value="filters.sort"
          class="filter-select"
          @change="emit('update', { sort: ($event.target as HTMLSelectElement).value, page: 1 })"
        >
          <option value="card_number_asc">Card Number ↑</option>
          <option value="card_number_desc">Card Number ↓</option>
          <option value="name_asc">Name A → Z</option>
          <option value="name_desc">Name Z → A</option>
          <option value="rarity_asc">Rarity (Common first)</option>
          <option value="rarity_desc">Rarity (Rare first)</option>
          <option value="cost_asc">Cost ↑</option>
          <option value="cost_desc">Cost ↓</option>
        </select>
      </div>

      <!-- Active filters summary -->
      <div v-if="hasActiveFilters" class="active-filters-box">
        <div class="active-filters-header">
          <span class="active-filters-count">{{ activeChips.length }} active {{ activeChips.length === 1 ? 'filter' : 'filters' }}</span>
          <button class="active-clear-btn" @click="emit('reset')">Clear all</button>
        </div>
        <div class="chip-wrap">
          <span
            v-for="chip in activeChips"
            :key="chip.key"
            class="active-chip"
          >
            {{ chip.label }}
            <button
              class="active-chip-remove"
              :aria-label="`Remove ${chip.label} filter`"
              @click="clearChip(chip.key)"
            >✕</button>
          </span>
        </div>
      </div>

    </div>

    <!-- ── Accordion sections ──────────────────────────────────── -->
    <div class="accordion-list">

      <!-- Section: Quick Filters -->
      <div class="accordion-item">
        <button class="accordion-trigger" :aria-expanded="open.has('quick')" @click="toggle('quick')">
          <span>Quick Filters</span>
          <svg class="accordion-chevron" :class="{ 'rotated': open.has('quick') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="open.has('quick')" class="accordion-body">

          <!-- Language -->
          <div class="filter-field">
            <label class="field-label">Language</label>
            <div class="grid-2col">
              <button
                v-for="l in langOptions"
                :key="l.code"
                class="pill"
                :class="filters.language === l.code ? 'pill-on' : 'pill-off'"
                :aria-pressed="filters.language === l.code"
                @click="emit('update', { language: filters.language === l.code ? '' : l.code, page: 1 })"
              >{{ l.name }}</button>
            </div>
          </div>

          <!-- Variant -->
          <div class="filter-field">
            <label class="field-label">Variant</label>
            <div class="chip-wrap">
              <button
                v-for="v in variantOptions"
                :key="v.value"
                class="pill"
                :class="filters.variant === v.value ? 'pill-on' : 'pill-off'"
                :aria-pressed="filters.variant === v.value"
                @click="emit('update', { variant: filters.variant === v.value ? '' : v.value, page: 1 })"
              >{{ v.label }}</button>
            </div>
          </div>

          <!-- Set (optional) -->
          <div v-if="showSet" class="filter-field">
            <label class="field-label">Set</label>
            <select
              :value="filters.set"
              class="filter-select"
              @change="emit('update', { set: ($event.target as HTMLSelectElement).value, page: 1 })"
            >
              <option value="">All Sets</option>
              <option v-for="s in filterOptions?.sets" :key="s.code" :value="s.code">
                {{ s.code }} — {{ s.name }}
              </option>
            </select>
          </div>

          <!-- Card Type -->
          <div class="filter-field">
            <label class="field-label">Card Type</label>
            <div class="chip-wrap">
              <button
                v-for="t in filterOptions?.card_types"
                :key="t.code"
                class="pill"
                :class="filters.card_type === t.code ? 'pill-type' : 'pill-off'"
                :aria-pressed="filters.card_type === t.code"
                @click="emit('update', { card_type: filters.card_type === t.code ? '' : t.code, page: 1 })"
              >{{ t.name }}</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Section: Card Details -->
      <div class="accordion-item">
        <button class="accordion-trigger" :aria-expanded="open.has('details')" @click="toggle('details')">
          <span>Card Details</span>
          <svg class="accordion-chevron" :class="{ 'rotated': open.has('details') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="open.has('details')" class="accordion-body">

          <!-- Color — 2-col grid -->
          <div class="filter-field">
            <label class="field-label">Color</label>
            <div class="grid-2col">
              <button
                v-for="c in filterOptions?.colors"
                :key="c.code"
                class="color-pill"
                :class="filters.color === c.code ? 'color-pill-on' : 'color-pill-off'"
                :style="filters.color === c.code ? { backgroundColor: c.hex, borderColor: c.hex, color: '#fff' } : {}"
                :aria-pressed="filters.color === c.code"
                @click="emit('update', { color: filters.color === c.code ? '' : c.code, page: 1 })"
              >
                <span class="color-dot" :style="{ backgroundColor: c.hex }" />
                <span>{{ c.name }}</span>
              </button>
            </div>
          </div>

          <!-- Rarity -->
          <div class="filter-field">
            <label class="field-label">Rarity</label>
            <div class="chip-wrap">
              <button
                v-for="r in filterOptions?.rarities"
                :key="r.code"
                class="pill"
                :class="filters.rarity === r.code ? 'pill-on' : 'pill-off'"
                :aria-pressed="filters.rarity === r.code"
                :title="r.name"
                @click="emit('update', { rarity: filters.rarity === r.code ? '' : r.code, page: 1 })"
              >{{ r.code }}</button>
            </div>
          </div>

          <!-- Attribute -->
          <div class="filter-field">
            <label class="field-label">Attribute</label>
            <select :value="filters.attribute" class="filter-select"
              @change="emit('update', { attribute: ($event.target as HTMLSelectElement).value, page: 1 })">
              <option value="">All Attributes</option>
              <option v-for="a in filterOptions?.attributes" :key="a.code" :value="a.code">{{ a.name }}</option>
            </select>
          </div>

          <!-- Affiliation -->
          <div class="filter-field">
            <label class="field-label">Affiliation</label>
            <select :value="filters.affiliation" class="filter-select"
              @change="emit('update', { affiliation: ($event.target as HTMLSelectElement).value, page: 1 })">
              <option value="">All Affiliations</option>
              <option v-for="a in filterOptions?.affiliations" :key="a.code" :value="a.code">{{ a.name }}</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Section: Stats -->
      <div class="accordion-item">
        <button class="accordion-trigger" :aria-expanded="open.has('stats')" @click="toggle('stats')">
          <span>Stats</span>
          <svg class="accordion-chevron" :class="{ 'rotated': open.has('stats') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="open.has('stats')" class="accordion-body">

          <div class="filter-field">
            <label class="field-label">Cost</label>
            <div class="range-grid">
              <div class="range-col">
                <span class="range-sublabel">Min</span>
                <input :value="filters.cost_min" type="number" min="0" placeholder="0" class="filter-input text-center"
                  @input="emit('update', { cost_min: ($event.target as HTMLInputElement).value, page: 1 })" />
              </div>
              <div class="range-sep">—</div>
              <div class="range-col">
                <span class="range-sublabel">Max</span>
                <input :value="filters.cost_max" type="number" min="0" placeholder="10" class="filter-input text-center"
                  @input="emit('update', { cost_max: ($event.target as HTMLInputElement).value, page: 1 })" />
              </div>
            </div>
          </div>

          <div class="filter-field">
            <label class="field-label">Power</label>
            <div class="range-grid">
              <div class="range-col">
                <span class="range-sublabel">Min</span>
                <input :value="filters.power_min" type="number" step="1000" placeholder="0" class="filter-input text-center"
                  @input="emit('update', { power_min: ($event.target as HTMLInputElement).value, page: 1 })" />
              </div>
              <div class="range-sep">—</div>
              <div class="range-col">
                <span class="range-sublabel">Max</span>
                <input :value="filters.power_max" type="number" step="1000" placeholder="12000" class="filter-input text-center"
                  @input="emit('update', { power_max: ($event.target as HTMLInputElement).value, page: 1 })" />
              </div>
            </div>
          </div>

          <div class="filter-field">
            <label class="field-label">Counter Value</label>
            <div class="chip-wrap">
              <button
                v-for="c in counterOptions"
                :key="c.value"
                class="pill"
                :class="filters.counter === c.value ? 'pill-on' : 'pill-off'"
                :aria-pressed="filters.counter === c.value"
                @click="emit('update', { counter: filters.counter === c.value ? '' : c.value, page: 1 })"
              >{{ c.label }}</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Section: Text & Effects -->
      <div class="accordion-item">
        <button class="accordion-trigger" :aria-expanded="open.has('text')" @click="toggle('text')">
          <span>Text &amp; Effects</span>
          <svg class="accordion-chevron" :class="{ 'rotated': open.has('text') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="open.has('text')" class="accordion-body">
          <label class="checkbox-row">
            <input type="checkbox" :checked="filters.has_effect === '1'"
              @change="emit('update', { has_effect: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
            <span>Has effect text</span>
          </label>
          <label class="checkbox-row">
            <input type="checkbox" :checked="filters.has_trigger === '1'"
              @change="emit('update', { has_trigger: ($event.target as HTMLInputElement).checked ? '1' : '', page: 1 })" />
            <span>Has trigger effect</span>
          </label>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { CardFiltersState, CatalogFilters } from '~/types/catalog'

const props = defineProps<{
  filters: CardFiltersState
  filterOptions: CatalogFilters | null
  showSetFilter?: boolean
}>()

const showSet = computed(() => props.showSetFilter !== false)

const emit = defineEmits<{
  update: [partial: Partial<CardFiltersState>]
  reset: []
}>()

const open = reactive(new Set(['quick', 'details']))
function toggle(key: string) {
  if (open.has(key)) open.delete(key)
  else open.add(key)
}

const searchInput = ref(props.filters.search)
watch(() => props.filters.search, v => { searchInput.value = v })
let searchTimer: ReturnType<typeof setTimeout> | null = null
function onSearchInput(value: string) {
  searchInput.value = value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => emit('update', { search: value, page: 1 }), 350)
}

const langOptions = [
  { code: 'EN',      name: 'English' },
  { code: 'JP',      name: 'Japanese' },
  { code: 'ZH_HANS', name: 'Simplified CN' },
  { code: 'KR',      name: 'Korean' },
]
const variantOptions = [
  { value: 'NORMAL',   label: 'Base' },
  { value: 'ALT_ART',  label: 'Alt Art' },
  { value: 'MANGA',    label: 'Manga' },
]
const counterOptions = [
  { value: '1000', label: '+1,000' },
  { value: '2000', label: '+2,000' },
]

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
  if (f.search)               chips.push({ key: 'search',      label: `"${f.search}"` })
  if (f.set && showSet.value) chips.push({ key: 'set',         label: `Set: ${f.set}` })
  if (f.card_type)            chips.push({ key: 'card_type',   label: f.card_type })
  if (f.color)                chips.push({ key: 'color',       label: f.color })
  if (f.rarity)               chips.push({ key: 'rarity',      label: f.rarity })
  if (f.attribute)            chips.push({ key: 'attribute',   label: f.attribute })
  if (f.affiliation)          chips.push({ key: 'affiliation', label: f.affiliation })
  if (f.variant)              chips.push({ key: 'variant',     label: f.variant === 'NORMAL' ? 'Base' : f.variant === 'MANGA' ? 'Manga' : 'Alt Art' })
  if (f.counter)              chips.push({ key: 'counter',     label: `Counter +${f.counter}` })
  if (f.language) {
    const name = langOptions.find(l => l.code === f.language)?.name ?? f.language
    chips.push({ key: 'language', label: name })
  }
  if (f.has_effect)  chips.push({ key: 'has_effect',  label: 'Has Effect' })
  if (f.has_trigger) chips.push({ key: 'has_trigger', label: 'Has Trigger' })
  return chips
})

function clearChip(key: keyof CardFiltersState) {
  emit('update', { [key]: key === 'page' ? 1 : '', page: 1 } as any)
}
</script>

<style scoped>
/* ── Panel shell ─────────────────────────────────────────────── */
.filter-panel {
  background: #ffffff;
  border: 1px solid #c8d3df;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.10);
}

/* ── Panel header ────────────────────────────────────────────── */
.filter-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f0f4f8;
}
.filter-panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.reset-all-btn {
  font-size: 13px;
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background-color 0.15s;
}
.reset-all-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* ── Always-visible body ─────────────────────────────────────── */
.filter-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: 1px solid #e2e8f0;
}

/* ── Active filters box ──────────────────────────────────────── */
.active-filters-box {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  border-radius: 10px;
  padding: 14px 16px;
}
.active-filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.active-filters-count {
  font-size: 12px;
  font-weight: 600;
  color: #0f766e;
}
.active-clear-btn {
  font-size: 12px;
  font-weight: 600;
  color: #0d9488;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.15s;
}
.active-clear-btn:hover {
  color: #0f172a;
}
.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: white;
  border: 1px solid #99f6e4;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: #0f766e;
}
.active-chip-remove {
  background: none;
  border: none;
  font-size: 11px;
  color: #5eead4;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.15s;
}
.active-chip-remove:hover {
  color: #0f766e;
}

/* ── Accordion ───────────────────────────────────────────────── */
.accordion-list {
  /* nothing extra needed */
}
.accordion-item {
  border-top: 1px solid #e2e8f0;
}
.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}
.accordion-trigger:hover {
  background: #f0f4f8;
  color: #111827;
}
.accordion-trigger:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: -2px;
}
.accordion-chevron {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.accordion-chevron.rotated {
  transform: rotate(180deg);
}
.accordion-body {
  padding: 4px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Field + label ───────────────────────────────────────────── */
.filter-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* ── Inputs / selects ────────────────────────────────────────── */
.filter-input {
  width: 100%;
  height: 42px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.filter-input::placeholder {
  color: #9ca3af;
}
.filter-input:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
}
.filter-select {
  width: 100%;
  height: 42px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 14px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  appearance: auto;
}
.filter-select:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
}

/* search icon wrapper */
.search-wrap {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  padding-left: 40px;
}

/* ── Chips / pills ───────────────────────────────────────────── */
.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #c8d3df;
  background: white;
  color: #4b5563;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}
.pill:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}
.pill-off:hover {
  border-color: #0d9488;
  color: #0f766e;
  background: #f0fdfa;
}
.pill-on {
  background: #0d9488;
  border-color: #0d9488;
  color: white;
  box-shadow: 0 1px 3px rgba(13, 148, 136, 0.3);
}
.pill-type {
  background: #1f2937;
  border-color: #1f2937;
  color: white;
  box-shadow: 0 1px 3px rgba(31, 41, 55, 0.3);
}

/* ── 2-col grid (language + color) ──────────────────────────── */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
/* Color pills use grid-2col but with left-aligned content */
.color-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #c8d3df;
  background: white;
  color: #4b5563;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s, box-shadow 0.15s;
}
.color-pill:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}
.color-pill-off:hover {
  border-color: #9ca3af;
  background: #f0f4f8;
}
.color-pill-on {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
}

/* ── Range inputs (cost/power) ───────────────────────────────── */
.range-grid {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.range-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.range-sublabel {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}
.range-sep {
  font-size: 16px;
  color: #d1d5db;
  padding-bottom: 9px;
  flex-shrink: 0;
}

/* ── Checkboxes ──────────────────────────────────────────────── */
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 0;
}
.checkbox-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  cursor: pointer;
  accent-color: #0d9488;
}
.checkbox-row span {
  font-size: 14px;
  color: #374151;
}
.checkbox-row:hover span {
  color: #111827;
}
</style>
