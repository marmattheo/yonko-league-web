<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Loading -->
    <div v-if="pending" class="flex flex-col lg:flex-row gap-8 animate-pulse">
      <div class="lg:w-72 shrink-0 space-y-3">
        <div class="aspect-[2/3] bg-gray-100 rounded-xl" />
        <div class="h-4 bg-gray-100 rounded w-3/4" />
      </div>
      <div class="flex-1 space-y-4">
        <div class="h-8 bg-gray-100 rounded w-2/3" />
        <div class="h-4 bg-gray-100 rounded w-1/3" />
        <div class="h-4 bg-gray-100 rounded w-1/2" />
        <div class="h-24 bg-gray-100 rounded" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <p class="text-gray-800 font-semibold">Card not found</p>
        <p class="text-gray-400 text-sm mt-1">{{ cardNumber }}</p>
        <NuxtLink to="/cards" class="btn-ghost mt-4 text-sm inline-flex">← Back to Cards</NuxtLink>
      </div>
    </div>

    <!-- Card detail -->
    <template v-else-if="card">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-gray-400 text-sm mb-6" aria-label="Breadcrumb">
        <NuxtLink to="/" class="hover:text-gray-700 transition-colors">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/cards" class="hover:text-gray-700 transition-colors">Cards</NuxtLink>
        <span v-if="card.set_code">/</span>
        <NuxtLink
          v-if="card.set_code"
          :to="`/sets/${card.set_code.code.toLowerCase()}`"
          class="hover:text-gray-700 transition-colors"
        >{{ card.set_code.code }}</NuxtLink>
        <span>/</span>
        <span class="text-gray-700 font-medium truncate max-w-[160px]">{{ card.display_number }}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left: image + printings -->
        <div class="lg:w-72 shrink-0 space-y-4">
          <div class="sticky top-20">
            <CatalogCardImage
              :src="selectedPrinting?.image_url ?? card.primary_image_url"
              :fallback-src="`https://en.onepiece-cardgame.com/images/card/${card.display_number}.png`"
              :alt="`${card.display_number} ${card.card_name}`"
              :is-reference="selectedPrinting?.is_reference_image ?? true"
            />

            <!-- Printings selector -->
            <div v-if="card.printings?.length" class="mt-4">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Printings</h3>
              <CatalogCardPrintingSelector
                :printings="card.printings"
                :selected="selectedPrinting"
                @select="selectPrinting($event)"
              />
            </div>
          </div>
        </div>

        <!-- Right: card info -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Name + badges -->
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1.5">
              <span class="font-mono text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded">
                {{ card.display_number }}
              </span>
              <span
                v-if="card.variant_type && card.variant_type.code !== 'NORMAL'"
                class="card-badge"
                :class="variantBadgeClass(card.variant_type.code)"
              >
                {{ card.variant_type.name }}
              </span>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">{{ card.card_name }}</h1>
          </div>

          <!-- Color + type + rarity badges -->
          <CatalogCardBadges
            :colors="card.colors"
            :card-type="card.card_type"
            :rarity="card.rarity"
          />

          <!-- Stats grid (skip for DON!!) -->
          <div v-if="hasStats" class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <div v-if="card.card_cost !== null" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Cost</div>
              <div class="text-2xl font-bold text-gray-900">{{ card.card_cost }}</div>
            </div>
            <div v-if="card.card_power !== null" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Power</div>
              <div class="text-xl font-bold text-gray-900">{{ card.card_power.toLocaleString() }}</div>
            </div>
            <div v-if="card.counter !== null" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Counter</div>
              <div class="text-2xl font-bold text-gray-900">+{{ card.counter }}</div>
            </div>
            <div v-if="card.card_type?.code === 'LEADER' && card.leader_life !== null"
              class="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center">
              <div class="text-xs text-teal-600 uppercase tracking-wide mb-1">Life</div>
              <div class="text-2xl font-bold text-teal-700">{{ card.leader_life }}</div>
            </div>
          </div>

          <!-- Info table -->
          <dl class="grid grid-cols-[auto_1fr] gap-y-2.5 gap-x-4 text-sm">
            <template v-if="card.set_code">
              <dt class="text-gray-400 font-medium whitespace-nowrap">Set</dt>
              <dd>
                <NuxtLink :to="`/sets/${card.set_code.code.toLowerCase()}`"
                  class="text-teal-700 hover:text-teal-800 font-medium transition-colors">
                  {{ card.set_code.name }}
                </NuxtLink>
              </dd>
            </template>
            <template v-if="card.card_type">
              <dt class="text-gray-400 font-medium">Type</dt>
              <dd class="text-gray-900">{{ card.card_type.name }}</dd>
            </template>
            <template v-if="card.rarity">
              <dt class="text-gray-400 font-medium">Rarity</dt>
              <dd class="text-gray-900">{{ card.rarity.name }} <span class="text-gray-400">({{ card.rarity.code }})</span></dd>
            </template>
            <template v-if="card.attribute">
              <dt class="text-gray-400 font-medium">Attribute</dt>
              <dd class="text-gray-900">{{ card.attribute.name }}</dd>
            </template>
            <template v-if="card.affiliations?.length">
              <dt class="text-gray-400 font-medium">Affiliations</dt>
              <dd class="text-gray-900">{{ card.affiliations.map(a => a.name).join(' / ') }}</dd>
            </template>
            <template v-if="card.artist">
              <dt class="text-gray-400 font-medium">Artist</dt>
              <dd class="text-gray-900">{{ card.artist }}</dd>
            </template>
          </dl>

          <!-- Effect text -->
          <CatalogCardEffectText
            :effect-text="card.effect_text"
            :trigger-text="card.trigger_text"
            :effects="card.effects"
          />

          <!-- Back link -->
          <div class="pt-2">
            <NuxtLink
              :to="card.set_code ? `/sets/${card.set_code.code.toLowerCase()}` : '/cards'"
              class="btn-ghost text-sm"
            >
              ← Back to {{ card.set_code?.name ?? 'Cards' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CardPrinting } from '~/types/catalog'

const router = useRouter()
const route = useRoute()
const cardNumber = computed(() => String(route.params.cardNumber))
const printingQuery = computed(() => route.query.printing ? Number(route.query.printing) : null)

const { card, pending, error, fetch } = useCardDetail()
await fetch(cardNumber.value)

useHead(() => ({
  title: card.value
    ? `${card.value.display_number} ${card.value.card_name} — Yonko League`
    : cardNumber.value,
  meta: [{
    name: 'description',
    content: card.value
      ? `View ${card.value.display_number} ${card.value.card_name} from ${card.value.set_code?.name ?? 'One Piece Card Game'}. ${card.value.card_type?.name ?? ''}, ${card.value.rarity?.name ?? ''}. ${card.value.effect_text ?? ''}`.trim()
      : '',
  }],
}))

const hasStats = computed(() => {
  if (!card.value) return false
  if (card.value.card_type?.code === 'DON') return false
  return card.value.card_cost !== null || card.value.card_power !== null || card.value.counter !== null
    || (card.value.card_type?.code === 'LEADER' && card.value.leader_life !== null)
})

function pickPrinting(printingId: number | null): CardPrinting | null {
  const printings = card.value?.printings ?? []
  if (printingId !== null) {
    return printings.find(p => p.id === printingId) ?? printings[0] ?? null
  }
  return printings.find(p => p.variant_type?.code === 'NORMAL' || p.variant_type == null) ?? printings[0] ?? null
}

const selectedPrinting = ref<CardPrinting | null>(pickPrinting(printingQuery.value))

watch(printingQuery, (id) => {
  selectedPrinting.value = pickPrinting(id)
})

function selectPrinting(printing: CardPrinting) {
  const isBase = (printing.variant_type?.code === 'NORMAL' || printing.variant_type == null) && !printing.is_promo
  router.replace({ query: isBase ? {} : { printing: printing.id } })
}

function variantBadgeClass(code: string): string {
  const map: Record<string, string> = {
    PARALLEL: 'bg-indigo-100 text-indigo-700',
    MANGA:    'bg-orange-100 text-orange-700',
    SP_CARD:  'bg-pink-100 text-pink-700',
    ALT_ART:  'bg-teal-100 text-teal-700',
  }
  return map[code] ?? 'bg-gray-100 text-gray-700'
}
</script>
