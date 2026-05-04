export interface CatalogSet {
  id: number
  code: string
  name: string
  series: string | null
  release_date: string | null
  is_active: boolean
  total_cards?: number
  base_count?: number
  variant_counts?: Record<string, number>
  type_counts?: Record<string, number>
}

export interface CardType {
  id: number
  code: string
  name: string
}

export interface Color {
  id: number
  code: string
  name: string
  hex: string
}

export interface Rarity {
  id: number
  code: string
  name: string
  sort_order: number
}

export interface Attribute {
  id: number
  code: string
  name: string
}

export interface Affiliation {
  id: number
  code: string
  name: string
}

export interface Language {
  id: number
  code: string
  name: string
}

export interface VariantType {
  id: number
  code: string
  name: string
}

export interface Finish {
  id: number
  code: string
  name: string
}

export interface EffectTiming {
  id: number
  code: string
  name: string
}

export interface CardEffect {
  id: number
  timing_id: number | null
  timing: EffectTiming | null
  label_text: string | null
  effect_text: string | null
  cost_text: string | null
  condition_text: string | null
  sort_order: number
  is_trigger: boolean
  is_active: boolean
}

export interface CardPrinting {
  id: number
  card_id: number
  language_id: number | null
  language: Language | null
  finish_profile: string | null
  finishes: Finish[]
  is_parallel: boolean
  is_promo: boolean
  notes: string | null
  is_active: boolean
  image_url: string | null
  is_reference_image: boolean
}

export interface Card {
  id: number
  card_name: string
  card_number: string
  display_number: string
  set_code_id: number
  set_code: CatalogSet | null
  card_type_id: number
  card_type: CardType | null
  rarity_id: number
  rarity: Rarity | null
  variant_type_id: number | null
  variant_type: VariantType | null
  attribute_id: number | null
  attribute: Attribute | null
  exclusive_language_id: number | null
  leader_life: number | null
  card_cost: number | null
  card_power: number | null
  counter: number | null
  artist: string | null
  effect_text: string | null
  trigger_text: string | null
  is_active: boolean
  colors: Color[]
  affiliations: Affiliation[]
  effects: CardEffect[]
  printings: CardPrinting[]
  primary_image_url: string | null
}

export interface CatalogFilters {
  sets: CatalogSet[]
  card_types: CardType[]
  colors: Color[]
  rarities: Rarity[]
  attributes: Attribute[]
  affiliations: Affiliation[]
  languages: Language[]
  variant_types: VariantType[]
}

export interface PaginatedCards {
  data: Card[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface CardFiltersState {
  search: string
  set: string
  card_type: string
  color: string
  rarity: string
  attribute: string
  affiliation: string
  variant: string
  cost_min: string
  cost_max: string
  power_min: string
  power_max: string
  counter: string
  leader_life: string
  has_effect: string
  has_trigger: string
  sort: string
  page: number
  per_page: number
}
