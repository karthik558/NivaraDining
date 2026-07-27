<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Check, ChefHat, Clock3, Search, SlidersHorizontal, X } from '@lucide/vue'
import ProductCard from '../components/ProductCard.vue'
import { state } from '../store'

const route = useRoute()
const search = ref(route.query.q || state.search)
const category = ref('All')
const sort = ref('featured')
const filtersOpen = ref(false)
const priceFloor = Math.floor(Math.min(...state.products.map((product) => product.price.max)) / 50) * 50
const priceCeiling = Math.ceil(Math.max(...state.products.map((product) => product.price.max)) / 50) * 50
const minPrice = ref(priceFloor)
const maxPrice = ref(priceCeiling)
const categories = computed(() => ['All', ...new Set(state.products.flatMap((product) => product.category?.map((item) => item.type) || []))])
const sliderStyle = computed(() => {
  const span = priceCeiling - priceFloor
  return {
    '--range-start': `${((minPrice.value - priceFloor) / span) * 100}%`,
    '--range-end': `${((maxPrice.value - priceFloor) / span) * 100}%`,
  }
})
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  const list = state.products.filter((product) => {
    const categoryMatch = category.value === 'All' || product.category?.some((item) => item.type === category.value)
    const priceMatch = product.price.max >= minPrice.value && product.price.max <= maxPrice.value
    return categoryMatch && priceMatch && (!term || product.title.toLowerCase().includes(term))
  })
  if (sort.value === 'price-low') return [...list].sort((a, b) => a.price.max - b.price.max)
  if (sort.value === 'price-high') return [...list].sort((a, b) => b.price.max - a.price.max)
  if (sort.value === 'rating') return [...list].sort((a, b) => b.rating - a.rating)
  return list
})
const filtersActive = computed(() => search.value || category.value !== 'All' || minPrice.value !== priceFloor || maxPrice.value !== priceCeiling)
watch(() => route.query.q, (value) => { if (typeof value === 'string') search.value = value })
watch(minPrice, (value) => { if (value > maxPrice.value) minPrice.value = maxPrice.value })
watch(maxPrice, (value) => { if (value < minPrice.value) maxPrice.value = minPrice.value })
const resetFilters = () => {
  search.value = ''
  category.value = 'All'
  minPrice.value = priceFloor
  maxPrice.value = priceCeiling
}
</script>

<template>
  <section class="relative min-h-[620px] overflow-hidden bg-[#211a20] text-white lg:min-h-[680px]">
    <img class="absolute inset-0 h-full w-full object-cover object-center lg:object-right" src="/assets/img/product/ai/ai-product-39.jpg" alt="Curated Lilac dining menu" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#211a20] via-[#211a20]/88 to-[#211a20]/15"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(120,38,113,.72),transparent_38%)]"></div>
    <div class="page-shell relative flex min-h-[620px] items-center py-16 lg:min-h-[680px]">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">In-room dining</p></div>
        <h1 class="mt-6 text-[clamp(3.7rem,8vw,7.4rem)] leading-[.9] font-semibold tracking-[-.07em]">A menu for<br />every mood.</h1>
        <p class="mt-7 max-w-xl text-lg leading-8 text-white/65">Seventy thoughtfully prepared dishes—from unhurried breakfasts and regional favourites to lighter plates and beautiful endings.</p>
        <div class="mt-8 flex flex-wrap gap-3 text-sm">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/7 px-4 py-2.5 backdrop-blur"><ChefHat :size="16" /> Made to order</span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/7 px-4 py-2.5 backdrop-blur"><Clock3 :size="16" /> 7:30 AM–10:30 PM</span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/7 px-4 py-2.5 backdrop-blur">70 selections</span>
        </div>
      </div>
    </div>
  </section>

  <section class="border-b border-line bg-white">
    <div class="page-shell flex gap-2 overflow-x-auto py-4">
      <button
        v-for="item in categories"
        :key="item"
        class="shrink-0 rounded-full border border-line px-4 py-2.5 text-sm font-semibold hover:border-lilac/35 hover:text-lilac"
        :class="{ 'border-lilac! bg-lilac! text-white!': category === item }"
        @click="category = item"
      >{{ item }}</button>
    </div>
  </section>

  <section class="section-space bg-canvas">
    <div class="page-shell">
      <div class="sticky top-3 z-30 mb-8 flex flex-col gap-3 rounded-2xl border border-line bg-white/92 p-3 shadow-card backdrop-blur-xl md:flex-row md:items-center">
        <div class="relative flex-1">
          <Search class="absolute top-1/2 left-4 -translate-y-1/2 text-muted" :size="18" />
          <input v-model="search" class="field border-0! bg-canvas! pl-11" type="search" placeholder="Search all 70 dishes" />
        </div>
        <button class="secondary-button md:hidden" @click="filtersOpen = true"><SlidersHorizontal :size="18" /> Price & filters</button>
        <select v-model="sort" class="field md:max-w-55" aria-label="Sort dining menu">
          <option value="featured">Our recommendations</option>
          <option value="rating">Guest favourites</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      <div class="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside :class="filtersOpen ? 'fixed inset-0 z-50 flex items-end bg-ink/45 backdrop-blur-sm lg:static lg:block lg:bg-transparent lg:backdrop-blur-none' : 'hidden lg:block'" @click.self="filtersOpen = false">
          <div class="w-full rounded-t-[28px] bg-white p-6 lg:sticky lg:top-24 lg:rounded-2xl lg:border lg:border-line">
            <div class="flex items-center justify-between">
              <div><p class="eyebrow">Refine</p><h2 class="mt-1 text-xl font-semibold">Your menu</h2></div>
              <button class="icon-button lg:hidden" aria-label="Close filters" @click="filtersOpen = false"><X :size="18" /></button>
            </div>
            <div class="mt-7">
              <div class="flex items-center justify-between"><h3 class="font-semibold">Price range</h3><span class="text-xs text-muted">per dish</span></div>
              <div class="mt-5 flex items-center justify-between"><span class="rounded-lg bg-lilac-soft px-3 py-2 text-sm font-bold text-lilac">₹{{ minPrice }}</span><span class="text-xs text-muted">to</span><span class="rounded-lg bg-lilac-soft px-3 py-2 text-sm font-bold text-lilac">₹{{ maxPrice }}</span></div>
              <div class="price-range mt-5" :style="sliderStyle">
                <div class="price-range__track"></div>
                <input v-model.number="minPrice" type="range" :min="priceFloor" :max="priceCeiling" step="50" aria-label="Minimum price" />
                <input v-model.number="maxPrice" type="range" :min="priceFloor" :max="priceCeiling" step="50" aria-label="Maximum price" />
              </div>
            </div>
            <div class="mt-7 border-t border-line pt-6">
              <h3 class="font-semibold">Selected category</h3>
              <div class="mt-3 flex items-center gap-3 rounded-xl bg-canvas p-3"><span class="grid size-8 place-items-center rounded-full bg-lilac text-white"><Check :size="15" /></span><span class="text-sm font-semibold">{{ category }}</span></div>
            </div>
            <button v-if="filtersActive" class="secondary-button mt-6 w-full" @click="resetFilters">Reset everything</button>
            <button class="primary-button mt-3 w-full lg:hidden" @click="filtersOpen = false">Show {{ filtered.length }} dishes</button>
          </div>
        </aside>

        <div>
          <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><p class="eyebrow">{{ category === 'All' ? 'Complete collection' : category }}</p><h2 class="mt-2 text-3xl font-semibold tracking-[-.035em]">{{ filtered.length }} dish{{ filtered.length === 1 ? '' : 'es' }}</h2></div>
            <button v-if="filtersActive" class="text-sm font-semibold text-lilac lg:hidden" @click="resetFilters">Clear filters</button>
          </div>
          <div v-if="filtered.length" class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
          </div>
          <div v-else class="surface grid min-h-96 place-items-center p-8 text-center">
            <div><span class="mx-auto grid size-14 place-items-center rounded-full bg-lilac-soft text-lilac"><Search :size="25" /></span><h2 class="mt-5 text-2xl font-semibold">Nothing matches just yet</h2><p class="mt-2 text-muted">Try widening your price range or choosing another category.</p><button class="primary-button mt-6" @click="resetFilters">Show the full menu</button></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
