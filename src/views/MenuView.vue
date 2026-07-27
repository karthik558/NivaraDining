<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Check, ChefHat, ChevronRight, Clock3, IndianRupee,
  Search, SlidersHorizontal, X,
} from '@lucide/vue'
import ProductCard from '../components/ProductCard.vue'
import { state } from '../store'

const route = useRoute()
const search = ref(route.query.q || state.search)
const category = ref('All')
const sort = ref('featured')
const filtersOpen = ref(false)
const priceFloor = 0
const priceCeiling = 2000
const minPrice = ref(priceFloor)
const maxPrice = ref(priceCeiling)
const draftMin = ref(priceFloor)
const draftMax = ref(priceCeiling)

const preferredCategories = [
  'All',
  'All Time Favorites',
  'Sandwiches',
  'Salads',
  'Burgers',
  'Breads',
  'Pizza',
  'Indian Entrées',
  'Desserts',
  'Drinks',
  'Starters',
]

const categoryAliases = {
  'Guest Favourites': 'All Time Favorites',
  Sandwich: 'Sandwiches',
  Beverages: 'Drinks',
  drinks: 'Drinks',
  Deserts: 'Desserts',
  Straters: 'Starters',
  'Indian Mains': 'Indian Entrées',
}

const productCategoryNames = (product) =>
  product.category?.map((item) => categoryAliases[item.type] || item.type) || []

const categoryCounts = computed(() =>
  Object.fromEntries(preferredCategories.map((item) => [
    item,
    item === 'All'
      ? state.products.length
      : state.products.filter((product) => productCategoryNames(product).includes(item)).length,
  ])),
)

const sliderStyle = computed(() => ({
  '--range-start': `${(draftMin.value / priceCeiling) * 100}%`,
  '--range-end': `${(draftMax.value / priceCeiling) * 100}%`,
}))

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  const list = state.products.filter((product) => {
    const categoryMatch = category.value === 'All' || productCategoryNames(product).includes(category.value)
    const priceMatch = product.price.max >= minPrice.value && product.price.max <= maxPrice.value
    const searchable = `${product.title} ${productCategoryNames(product).join(' ')}`.toLowerCase()
    return categoryMatch && priceMatch && (!term || searchable.includes(term))
  })
  if (sort.value === 'price-low') return [...list].sort((a, b) => a.price.max - b.price.max)
  if (sort.value === 'price-high') return [...list].sort((a, b) => b.price.max - a.price.max)
  if (sort.value === 'rating') return [...list].sort((a, b) => b.rating - a.rating)
  return list
})

const filtersActive = computed(() =>
  search.value || category.value !== 'All' || minPrice.value !== priceFloor || maxPrice.value !== priceCeiling,
)

const applyPrice = () => {
  minPrice.value = Math.min(draftMin.value, draftMax.value)
  maxPrice.value = Math.max(draftMin.value, draftMax.value)
  filtersOpen.value = false
}

const selectPriceBand = (minimum, maximum) => {
  draftMin.value = minimum
  draftMax.value = maximum
  applyPrice()
}

const selectCategory = (item) => {
  category.value = item
  filtersOpen.value = false
  nextTick(() => document.querySelector('#menu-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

const resetFilters = () => {
  search.value = ''
  category.value = 'All'
  minPrice.value = priceFloor
  maxPrice.value = priceCeiling
  draftMin.value = priceFloor
  draftMax.value = priceCeiling
}

watch(() => route.query.q, async (value) => {
  search.value = typeof value === 'string' ? value : ''
  await nextTick()
  document.querySelector('#menu-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
watch(draftMin, (value) => { if (value > draftMax.value) draftMin.value = draftMax.value })
watch(draftMax, (value) => { if (value < draftMin.value) draftMax.value = draftMin.value })

onMounted(() => {
  if (route.query.q || route.hash === '#menu-results') {
    nextTick(() => document.querySelector('#menu-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
})
</script>

<template>
  <section class="relative min-h-130 overflow-hidden bg-[#211a20] text-white lg:min-h-147.5">
    <img class="absolute inset-0 h-full w-full object-cover object-center lg:object-right" src="/assets/img/product/ai/ai-product-39.jpg" alt="Curated Lilac dining menu" />
    <div class="absolute inset-0 bg-linear-to-r from-[#211a20] via-[#211a20]/88 to-[#211a20]/15"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(120,38,113,.72),transparent_38%)]"></div>
    <div class="page-shell relative flex min-h-130 items-center py-16 lg:min-h-147.5">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">In-room dining</p></div>
        <h1 class="mt-6 text-[clamp(3.2rem,7vw,6.7rem)] leading-[.9] font-semibold tracking-[-.07em]">A menu for<br />every mood.</h1>
        <p class="mt-7 max-w-xl text-lg leading-8 text-white/65">Thoughtfully prepared dishes—from unhurried breakfasts and regional favourites to lighter plates and beautiful endings.</p>
        <div class="mt-8 flex flex-wrap gap-3 text-sm">
          <span class="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/7 px-4 py-2.5 backdrop-blur"><ChefHat :size="16" /> Made to order</span>
          <span class="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/7 px-4 py-2.5 backdrop-blur"><Clock3 :size="16" /> 7:30 AM–10:30 PM</span>
        </div>
      </div>
    </div>
  </section>

  <section id="menu-results" class="scroll-mt-28 bg-canvas py-10 md:py-14 lg:py-16">
    <div class="page-shell">
      <div class="mb-8 grid gap-4 rounded-xl border border-line bg-white p-4 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-5">
        <div class="relative">
          <Search class="absolute top-1/2 left-4 -translate-y-1/2 text-muted" :size="19" />
          <input v-model="search" class="field min-h-13 rounded-lg bg-canvas! pl-12" type="search" placeholder="Search dishes, categories, or flavours" />
        </div>
        <div class="flex gap-3">
          <button class="secondary-button flex-1 md:hidden" @click="filtersOpen = true"><SlidersHorizontal :size="18" /> Categories & price</button>
          <select v-model="sort" class="field min-h-13 md:w-58" aria-label="Sort dining menu">
            <option value="featured">Our recommendations</option>
            <option value="rating">Guest favourites</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div class="grid items-start gap-8 lg:grid-cols-[285px_1fr]">
        <aside :class="filtersOpen ? 'fixed inset-0 z-50 flex items-end bg-ink/45 backdrop-blur-sm lg:static lg:block lg:bg-transparent lg:backdrop-blur-none' : 'hidden lg:block'" @click.self="filtersOpen = false">
          <div class="max-h-[88svh] w-full overflow-y-auto rounded-t-xl bg-white p-5 lg:sticky lg:top-5 lg:max-h-[calc(100svh-40px)] lg:rounded-xl lg:border lg:border-line lg:p-6 lg:shadow-card">
            <div class="flex items-center justify-between">
              <div><p class="eyebrow">Browse by</p><h2 class="mt-1 text-2xl font-semibold">Category</h2></div>
              <button class="icon-button lg:hidden" aria-label="Close filters" @click="filtersOpen = false"><X :size="18" /></button>
            </div>

            <nav class="mt-5 grid gap-1" aria-label="Product categories">
              <button
                v-for="item in preferredCategories"
                :key="item"
                class="flex min-h-11 items-center justify-between rounded-xl px-3 text-left text-sm font-semibold text-muted hover:bg-lilac-soft hover:text-lilac"
                :class="{ 'bg-lilac-soft! text-lilac!': category === item }"
                @click="selectCategory(item)"
              >
                <span class="flex items-center gap-2"><Check v-if="category === item" :size="15" /><span>{{ item }}</span></span>
                <span class="flex items-center gap-1 text-xs font-medium opacity-65">{{ categoryCounts[item] }} <ChevronRight :size="13" /></span>
              </button>
            </nav>

            <div class="mt-7 border-t border-line pt-6">
              <div class="flex items-center justify-between"><h2 class="text-xl font-semibold">Price range</h2><IndianRupee class="text-lilac" :size="18" /></div>
              <p class="mt-2 text-sm text-muted">Price range: <strong class="text-ink">₹{{ draftMin }} – ₹{{ draftMax }}</strong></p>

              <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <label class="grid gap-1.5 text-xs font-semibold text-muted">Min
                  <span class="flex items-center rounded-xl border border-line bg-canvas px-3"><span>₹</span><input v-model.number="draftMin" class="min-w-0 flex-1 bg-transparent py-3 pl-1 outline-none" type="number" min="0" max="2000" step="50" /></span>
                </label>
                <span class="pb-3 text-muted">–</span>
                <label class="grid gap-1.5 text-xs font-semibold text-muted">Max
                  <span class="flex items-center rounded-xl border border-line bg-canvas px-3"><span>₹</span><input v-model.number="draftMax" class="min-w-0 flex-1 bg-transparent py-3 pl-1 outline-none" type="number" min="0" max="2000" step="50" /></span>
                </label>
              </div>

              <div class="price-range mt-5" :style="sliderStyle">
                <div class="price-range__track"></div>
                <input v-model.number="draftMin" type="range" min="0" max="2000" step="50" aria-label="Minimum price" />
                <input v-model.number="draftMax" type="range" min="0" max="2000" step="50" aria-label="Maximum price" />
              </div>

              <div class="mt-5 grid grid-cols-2 gap-2">
                <button class="primary-button min-h-11 px-4!" @click="applyPrice">Apply</button>
                <button class="secondary-button min-h-11 px-4!" @click="resetFilters">Reset</button>
              </div>

              <div class="mt-5 grid gap-2">
                <button class="rounded-xl border border-line px-3 py-2.5 text-left text-sm font-semibold hover:border-lilac/30 hover:bg-lilac-soft hover:text-lilac" @click="selectPriceBand(0, 499)">Under ₹500</button>
                <button class="rounded-xl border border-line px-3 py-2.5 text-left text-sm font-semibold hover:border-lilac/30 hover:bg-lilac-soft hover:text-lilac" @click="selectPriceBand(500, 1000)">₹500 – ₹1000</button>
                <button class="rounded-xl border border-line px-3 py-2.5 text-left text-sm font-semibold hover:border-lilac/30 hover:bg-lilac-soft hover:text-lilac" @click="selectPriceBand(1001, 2000)">Above ₹1000</button>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="eyebrow">{{ search ? `Results for “${search}”` : category === 'All' ? 'Complete collection' : category }}</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-[-.035em]">{{ filtered.length }} dish{{ filtered.length === 1 ? '' : 'es' }}</h2>
            </div>
            <button v-if="filtersActive" class="rounded-full bg-lilac-soft px-4 py-2 text-sm font-semibold text-lilac hover:bg-lilac hover:text-white" @click="resetFilters">Clear all filters</button>
          </div>

          <div v-if="filtered.length" class="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
          </div>
          <div v-else class="surface grid min-h-96 place-items-center p-8 text-center">
            <div><span class="mx-auto grid size-14 place-items-center rounded-lg bg-lilac-soft text-lilac"><Search :size="25" /></span><h2 class="mt-5 text-2xl font-semibold">Nothing matches just yet</h2><p class="mt-2 text-muted">Try another search, category, or price range.</p><button class="primary-button mt-6" @click="resetFilters">Show the full menu</button></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
