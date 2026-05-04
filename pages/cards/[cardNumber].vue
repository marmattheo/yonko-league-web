<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="pending" class="flex flex-col lg:flex-row gap-8 animate-pulse">
      <div class="lg:w-80 shrink-0 space-y-4">
        <div class="aspect-[2/3] bg-gray-800 rounded-xl" />
        <div class="h-4 bg-gray-800 rounded w-3/4" />
      </div>
      <div class="flex-1 space-y-4">
        <div class="h-8 bg-gray-800 rounded w-2/3" />
        <div class="h-4 bg-gray-800 rounded w-1/3" />
        <div class="h-4 bg-gray-800 rounded w-1/2" />
        <div class="h-24 bg-gray-800 rounded" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <p class="text-red-400 font-semibold">Card not found</p>
        <p class="text-gray-500 text-sm">{{ cardNumber }}</p>
        <NuxtLink to="/cards" class="btn-ghost mt-4 text-sm">← Back to Cards</NuxtLink>
      </div>
    </div>

    <!-- Card detail -->
    <template v-else-if="card">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-gray-500 text-sm mb-6">
        <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/cards" class="hover:text-white">Cards</NuxtLink>
        <span>/</span>
        <NuxtLink v-if="card.set_code" :to="`/sets/${card.set_code.code.toLowerCase()}`" class="hover:text-white">
          {{ card.set_code.code }}
        </NuxtLink>
        <span>/</span>
        <span class="text-gray-300">{{ card.display_number }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left: image + printing selector -->
        <div class="lg:w-80 shrink-0 space-y-4">
          <CatalogCardImage
            :src="selectedPrinting?.image_url ?? card.primary_image_url"
            :alt="`${card.display_number} ${card.card_name}`"
            :is-reference="selectedPrinting?.is_reference_image ?? true"
          />

          <!-- Printings -->
          <div v-if="card.printings?.length">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Printings</h3>
            <CatalogCardPrintingSelector
              :printings="card.printings"
              :selected="selectedPrinting"
              @select="selectedPrinting = $event"
            />
          </div>
        </div>

        <!-- Right: card info -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Name + number -->
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="font-mono text-gray-400 text-sm bg-gray-800 px-2 py-0.5 rounded">
                {{ card.display_number }}
              </span>
              <!-- Variant type badge -->
              <span
                v-if="card.variant_type && card.variant_type.code !== 'NORMAL'"
                class="card-badge"
                :class="variantBadgeClass(card.variant_type.code)"
              >
                {{ card.variant_type.name }}
              </span>
            </div>
            <h1 class="text-3xl font-extrabold text-white mt-2 leading-tight">{{ card.card_name }}</h1>
          </div>

          <!-- Badges row -->
          <CatalogCardBadges
            :colors="card.colors"
            :card-type="card.card_type"
            :rarity="card.rarity"
          />

          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <template v-if="card.card_type?.code !== 'DON'">
              <div v-if="card.card_cost !== null" class="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Cost</div>
                <div class="text-2xl font-bold text-white">{{ card.card_cost }}</div>
              </div>
              <div v-if="card.card_power !== null" class="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Power</div>
                <div class="text-2xl font-bold text-white">{{ card.card_power.toLocaleString() }}</div>
              </div>
              <div v-if="card.counter !== null" class="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Counter</div>
                <div class="text-2xl font-bold text-white">+{{ card.counter }}</div>
              </div>
            </template>
            <div v-if="card.card_type?.code === 'LEADER' && card.leader_life !== null" class="bg-gray-900 border border-yellow-700/30 rounded-lg p-3 text-center">
              <div class="text-xs text-yellow-600 uppercase tracking-wide mb-1">Life</div>
              <div class="text-2xl font-bold text-yellow-400">{{ card.leader_life }}</div>
            </div>
          </div>

          <!-- Card info table -->
          <dl class="grid grid-cols-2 gap-2 text-sm">
            <template v-if="card.set_code">
              <dt class="text-gray-500">Set</dt>
              <dd>
                <NuxtLink :to="`/sets/${card.set_code.code.toLowerCase()}`" class="text-white hover:text-red-400 transition-colors">
                  {{ card.set_code.name }}
                </NuxtLink>
              </dd>
            </template>
            <template v-if="card.card_type">
              <dt class="text-gray-500">Type</dt>
              <dd class="text-white">{{ card.card_type.name }}</dd>
            </template>
            <template v-if="card.rarity">
              <dt class="text-gray-500">Rarity</dt>
              <dd class="text-white">{{ card.rarity.name }} ({{ card.rarity.code }})</dd>
            </template>
            <template v-if="card.attribute">
              <dt class="text-gray-500">Attribute</dt>
              <dd class="text-white">{{ card.attribute.name }}</dd>
            </template>
            <template v-if="card.affiliations?.length">
              <dt class="text-gray-500">Affiliations</dt>
              <dd class="text-white">{{ card.affiliations.map(a => a.name).join(', ') }}</dd>
            </template>
            <template v-if="card.artist">
              <dt class="text-gray-500">Artist</dt>
              <dd class="text-white">{{ card.artist }}</dd>
            </template>
          </dl>

          <!-- Effect text -->
          <CatalogCardEffectText
            :effect-text="card.effect_text"
            :trigger-text="card.trigger_text"
            :effects="card.effects"
          />

          <!-- Back link -->
          <div class="pt-4">
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

const route = useRoute()
const cardNumber = computed(() => String(route.params.cardNumber))

const { card, pending, error, fetch } = useCardDetail()

await fetch(cardNumber.value)

useHead(() => ({
  title: card.value
    ? `${card.value.display_number} ${card.value.card_name}`
    : cardNumber.value,
  meta: [{
    name: 'description',
    content: card.value
      ? `View ${card.value.display_number} ${card.value.card_name} from One Piece Card Game ${card.value.set_code?.name ?? ''}. ${card.value.card_type?.name ?? ''}, ${card.value.rarity?.name ?? ''}. ${card.value.effect_text ?? ''}`.trim()
      : '',
  }],
}))

const selectedPrinting = ref<CardPrinting | null>(
  card.value?.printings?.find(p => !p.is_parallel) ?? card.value?.printings?.[0] ?? null
)

function variantBadgeClass(code: string): string {
  const map: Record<string, string> = {
    PARALLEL: 'bg-indigo-600 text-indigo-100',
    MANGA:    'bg-orange-600 text-orange-100',
    SP_CARD:  'bg-pink-600 text-pink-100',
    ALT_ART:  'bg-teal-600 text-teal-100',
  }
  return map[code] ?? 'bg-gray-600 text-gray-200'
}
</script>
