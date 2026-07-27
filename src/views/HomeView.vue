<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ArrowLeft, ArrowRight, Check, ChefHat, Clock3, ConciergeBell,
  Leaf, Pause, Play, Plus, Quote, Star, UtensilsCrossed,
} from '@lucide/vue'
import ProductCard from '../components/ProductCard.vue'
import { addToCart, state } from '../store'
import testimonials from '../../data/testimonials.json'

const heroIndex = ref(0)
const heroPaused = ref(false)
const menuCategory = ref('Breakfast')
const trayType = ref('slow morning')
const testimonialIndex = ref(0)

const heroSlides = [
  {
    eyebrow: 'The art of staying in',
    title: 'Your room. Your table. Your moment.',
    copy: 'A considered in-room dining experience—freshly prepared, beautifully presented, and delivered with the quiet warmth of Lilac.',
    image: '/assets/img/product/ai/ai-product-28.jpg',
    dish: 'Vegetable Biryani',
    note: 'Aromatic · Slow cooked',
  },
  {
    eyebrow: 'Rooted in flavour',
    title: 'Local comfort, elevated.',
    copy: 'Regional recipes and familiar favourites come together in a menu designed around how you want to feel.',
    image: '/assets/img/product/ai/ai-product-38.jpg',
    dish: 'South Indian Thali',
    note: 'Balanced · Generous',
  },
  {
    eyebrow: 'A beautiful finish',
    title: 'Leave room for delight.',
    copy: 'Handcrafted desserts, cooling drinks, and small indulgences—because the best stays deserve a memorable last course.',
    image: '/assets/img/product/ai/ai-product-45.jpg',
    dish: 'Baked Cheesecake',
    note: 'Silky · Hand finished',
  },
]

const categoryTabs = [
  { label: 'Breakfast', image: '/assets/img/product/ai/ai-product-01.jpg' },
  { label: 'Indian Entrées', image: '/assets/img/product/ai/ai-product-26.jpg' },
  { label: 'Salads', image: '/assets/img/product/ai/ai-product-12.jpg' },
  { label: 'Desserts', image: '/assets/img/product/ai/ai-product-44.jpg' },
  { label: 'Drinks', image: '/assets/img/product/ai/ai-product-49.jpg' },
]

const trayOptions = {
  'slow morning': {
    eyebrow: 'Ease into the day',
    title: 'The slow morning tray',
    copy: 'A warm South Indian breakfast, bright fruit, and proper filter coffee.',
    ids: [22, 23, 60, 69],
  },
  'comfort dinner': {
    eyebrow: 'Settle in',
    title: 'The comfort dinner',
    copy: 'Rich, familiar flavours for an evening when only comfort will do.',
    ids: [26, 44, 46, 50],
  },
  'light lunch': {
    eyebrow: 'Fresh and balanced',
    title: 'The lighter lunch',
    copy: 'Colourful, nourishing plates with a refreshing finish.',
    ids: [28, 30, 32, 70],
  },
}

const currentHero = computed(() => heroSlides[heroIndex.value])
const activeCategoryProducts = computed(() => {
  const matches = state.products.filter((product) =>
    product.category?.some((category) => category.type === menuCategory.value),
  )
  return matches.slice(0, 4)
})
const activeTray = computed(() => trayOptions[trayType.value])
const trayProducts = computed(() =>
  activeTray.value.ids.map((id) => state.products.find((product) => product.id === id)).filter(Boolean),
)
const trayTotal = computed(() => trayProducts.value.reduce((total, product) => total + product.price.max, 0))
const currentTestimonial = computed(() => testimonials[testimonialIndex.value])

const setHero = (index) => { heroIndex.value = index }
const nextHero = () => { heroIndex.value = (heroIndex.value + 1) % heroSlides.length }
const previousHero = () => { heroIndex.value = (heroIndex.value - 1 + heroSlides.length) % heroSlides.length }
const nextTestimonial = () => { testimonialIndex.value = (testimonialIndex.value + 1) % testimonials.length }
const previousTestimonial = () => { testimonialIndex.value = (testimonialIndex.value - 1 + testimonials.length) % testimonials.length }
const addTray = () => trayProducts.value.forEach(addToCart)

let heroTimer
onMounted(() => {
  heroTimer = window.setInterval(() => {
    if (!heroPaused.value) nextHero()
  }, 6000)
})
onBeforeUnmount(() => window.clearInterval(heroTimer))
</script>

<template>
  <section
    class="hero-stage relative overflow-hidden bg-[#241d23]"
    @mouseenter="heroPaused = true"
    @mouseleave="heroPaused = false"
  >
    <div class="hero-glow hero-glow--one"></div>
    <div class="hero-glow hero-glow--two"></div>
    <div class="relative">
      <div class="relative grid min-h-[520px] overflow-hidden bg-[#241d23] text-white lg:h-[590px] lg:min-h-0 lg:grid-cols-[.9fr_1.1fr]">
        <div class="relative z-20 flex flex-col justify-end px-6 pt-14 pb-12 sm:px-10 lg:justify-center lg:px-[clamp(3.5rem,7vw,8.5rem)] lg:pt-10 lg:pb-24">
          <Transition name="hero-copy" mode="out-in">
            <div :key="currentHero.title">
              <div class="flex items-center gap-3">
                <span class="h-px w-9 bg-white/40"></span>
                <p class="text-[11px] font-bold tracking-[.22em] text-white/65 uppercase">{{ currentHero.eyebrow }}</p>
              </div>
              <h1
                class="mt-6 max-w-2xl leading-[.94] font-semibold tracking-[-.065em]"
                :class="heroIndex === 0 ? 'text-[clamp(2.5rem,4.35vw,4.45rem)]' : 'text-[clamp(2.8rem,5.4vw,5.2rem)]'"
              >{{ currentHero.title }}</h1>
              <p class="mt-6 max-w-xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">{{ currentHero.copy }}</p>
            </div>
          </Transition>

          <div class="mt-9 flex flex-wrap gap-3">
            <RouterLink class="inline-flex min-h-13 items-center gap-2 rounded-lg bg-white px-6 font-semibold text-lilac hover:-translate-y-0.5 hover:bg-lilac-soft" :to="{ path: '/product', hash: '#menu-results' }">
              Explore the menu <ArrowRight :size="18" />
            </RouterLink>
            <button class="inline-flex min-h-13 items-center gap-2 rounded-lg border border-white/18 px-5 font-semibold text-white hover:bg-white/8" @click="heroPaused = !heroPaused">
              <Pause v-if="!heroPaused" :size="17" /><Play v-else :size="17" />
              {{ heroPaused ? 'Play story' : 'Pause story' }}
            </button>
          </div>

          <div class="mt-9 flex items-center gap-4 lg:absolute lg:bottom-8 lg:left-[clamp(3.5rem,7vw,8.5rem)] lg:mt-0">
            <button class="grid size-11 place-items-center rounded-full border border-white/18 hover:bg-white hover:text-ink" aria-label="Previous story" @click="previousHero"><ArrowLeft :size="18" /></button>
            <div class="flex gap-2">
              <button
                v-for="(_, index) in heroSlides"
                :key="index"
                class="h-1.5 overflow-hidden rounded-full bg-white/18"
                :class="index === heroIndex ? 'w-14' : 'w-6'"
                :aria-label="`Show story ${index + 1}`"
                @click="setHero(index)"
              >
                <span v-if="index === heroIndex" class="hero-progress block h-full rounded-full bg-white"></span>
              </button>
            </div>
            <button class="grid size-11 place-items-center rounded-full border border-white/18 hover:bg-white hover:text-ink" aria-label="Next story" @click="nextHero"><ArrowRight :size="18" /></button>
          </div>
        </div>

        <div class="relative order-first min-h-[280px] overflow-hidden sm:min-h-[320px] lg:order-last lg:min-h-full">
          <Transition name="hero-image" mode="out-in">
            <img :key="currentHero.image" class="absolute inset-0 h-full w-full object-cover" :src="currentHero.image" :alt="currentHero.dish" />
          </Transition>
          <div class="absolute inset-0 bg-gradient-to-t from-[#241d23] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#241d23] lg:via-[#241d23]/5 lg:to-transparent"></div>
          <div class="absolute right-5 bottom-6 left-5 flex min-h-20 items-center gap-4 rounded-lg border border-white/20 bg-white/92 p-4 text-ink shadow-2xl backdrop-blur-xl sm:right-8 sm:left-auto sm:w-72 lg:right-10 lg:bottom-8">
            <span class="grid size-12 shrink-0 place-items-center rounded-full bg-lilac text-white"><ChefHat :size="21" /></span>
            <div class="min-w-0"><strong class="block truncate">{{ currentHero.dish }}</strong><small class="mt-0.5 block text-muted">{{ currentHero.note }}</small></div>
          </div>
          <div class="hero-float hero-float--delay absolute top-7 right-6 hidden border border-white/20 bg-white/88 px-4 py-3 text-ink shadow-xl backdrop-blur-xl sm:block lg:top-12 lg:right-12">
            <div class="flex gap-1 text-[#b57a13]"><Star v-for="star in 5" :key="star" :size="12" fill="currentColor" /></div>
            <small class="mt-1 block font-semibold">Guest favourite</small>
          </div>
        </div>
      </div>

      <div class="relative z-30 grid border-t border-white/10 bg-[#1e181d] text-white sm:grid-cols-3">
        <div v-for="(item, index) in [
          { icon: ChefHat, title: 'Made to order', copy: 'Fresh from the Lilac kitchen' },
          { icon: Clock3, title: 'All-day ease', copy: '7:30 AM–10:30 PM, every day' },
          { icon: ConciergeBell, title: 'Room-side service', copy: 'Delivered with thoughtful care' }
        ]" :key="item.title" class="flex items-center gap-4 px-6 py-5 sm:justify-center sm:px-5 lg:py-6" :class="{ 'border-t border-white/8 sm:border-t-0 sm:border-l': index }">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-white/8 text-white"><component :is="item.icon" :size="20" /></span>
          <span><strong class="block">{{ item.title }}</strong><small class="text-white/45">{{ item.copy }}</small></span>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space overflow-hidden">
    <div class="page-shell">
      <div class="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div><p class="eyebrow">Find your flavour</p><h2 class="section-title mt-3 max-w-xl">What are you in the mood for?</h2></div>
        <RouterLink class="inline-flex items-center gap-2 font-semibold text-lilac" to="/product">See the full menu <ArrowRight :size="17" /></RouterLink>
      </div>

      <div class="mt-8 flex gap-2 overflow-x-auto pb-3">
        <button
          v-for="category in categoryTabs"
          :key="category.label"
          class="flex shrink-0 items-center gap-3 rounded-lg border border-line bg-white py-2 pr-5 pl-2 text-sm font-semibold hover:border-lilac/30"
          :class="{ 'border-lilac! bg-lilac! text-white!': menuCategory === category.label }"
          @click="menuCategory = category.label"
        >
          <img class="size-9 rounded-full object-cover" :src="category.image" alt="" />{{ category.label }}
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <div :key="menuCategory" class="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-5 md:grid-cols-4">
          <ProductCard v-for="product in activeCategoryProducts" :key="product.id" :product="product" />
        </div>
      </Transition>
    </div>
  </section>

  <section class="pb-14 md:pb-20 lg:pb-24">
    <div class="page-shell">
      <div class="grid gap-5 lg:grid-cols-[1.12fr_.88fr]">
        <RouterLink to="/product" class="editorial-card group relative min-h-[490px] overflow-hidden rounded-xl bg-ink">
          <img class="absolute inset-0 h-full w-full object-cover opacity-90 duration-700 group-hover:scale-105" src="/assets/img/product/ai/ai-product-38.jpg" alt="South Indian thali" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent"></div>
          <div class="absolute right-0 bottom-0 left-0 p-7 text-white sm:p-10">
            <span class="inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur">Regional table</span>
            <h2 class="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">A generous taste of the South.</h2>
            <span class="mt-6 inline-flex items-center gap-2 font-semibold">Discover local favourites <ArrowRight :size="18" /></span>
          </div>
        </RouterLink>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <RouterLink v-for="feature in [
            { title: 'Bright. Fresh. Balanced.', eyebrow: 'A lighter table', image: '/assets/img/product/ai/ai-product-12.jpg' },
            { title: 'Finish beautifully.', eyebrow: 'A little indulgence', image: '/assets/img/product/ai/ai-product-44.jpg' }
          ]" :key="feature.title" to="/product" class="editorial-card group relative min-h-58 overflow-hidden rounded-xl bg-ink">
            <img class="absolute inset-0 h-full w-full object-cover opacity-85 duration-700 group-hover:scale-105" :src="feature.image" :alt="feature.title" />
            <div class="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent"></div>
            <div class="absolute inset-y-0 left-0 flex max-w-sm flex-col justify-center p-7 text-white"><p class="text-xs font-bold tracking-[.16em] text-white/65 uppercase">{{ feature.eyebrow }}</p><h3 class="mt-3 text-3xl leading-tight font-semibold tracking-[-.03em]">{{ feature.title }}</h3><ArrowRight class="mt-5" :size="19" /></div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space relative overflow-hidden bg-lilac text-white">
    <div class="tray-orbit tray-orbit--one"></div>
    <div class="tray-orbit tray-orbit--two"></div>
    <div class="page-shell relative">
      <div class="grid items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-14">
        <div>
          <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.2em] text-white/65 uppercase">The Lilac table</p></div>
          <h2 class="mt-5 text-4xl leading-[1.04] font-semibold tracking-[-.05em] md:text-5xl lg:text-[3.5rem]">Comforting food, made with thoughtful details.</h2>
          <p class="mt-6 max-w-lg text-lg leading-8 text-white/68">Every tray is considered as a whole—from flavour and freshness to the moment it arrives at your door.</p>
          <div class="mt-8 grid max-w-lg grid-cols-2 gap-3">
            <div v-for="detail in [
              { icon: Leaf, label: 'Fresh ingredients' },
              { icon: ChefHat, label: 'Made to order' },
              { icon: Clock3, label: 'Timed with care' },
              { icon: ConciergeBell, label: 'Quietly delivered' }
            ]" :key="detail.label" class="flex items-center gap-3 rounded-2xl border border-white/14 bg-white/7 p-3.5">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-white/12"><component :is="detail.icon" :size="16" /></span>
              <span class="text-sm font-semibold">{{ detail.label }}</span>
            </div>
          </div>
          <p class="mt-8 text-xs font-bold tracking-[.16em] text-white/50 uppercase">Choose your dining mood</p>
          <div class="mt-8 flex flex-wrap gap-2">
            <button v-for="(_, key) in trayOptions" :key="key" class="rounded-lg border border-white/18 px-4 py-2.5 text-sm font-semibold capitalize hover:bg-white/10" :class="{ 'bg-white! text-lilac!': trayType === key }" @click="trayType = key">{{ key }}</button>
          </div>
        </div>

        <Transition name="fade" mode="out-in">
          <div :key="trayType" class="relative overflow-hidden rounded-xl bg-white p-4 text-ink shadow-[0_30px_80px_rgba(40,16,37,.22)] sm:p-6">
            <div class="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-lilac-soft"></div>
            <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div class="relative"><p class="text-xs font-bold tracking-[.16em] text-lilac uppercase">{{ activeTray.eyebrow }}</p><h3 class="mt-2 text-2xl font-semibold">{{ activeTray.title }}</h3><p class="mt-2 max-w-md text-sm text-muted">{{ activeTray.copy }}</p></div>
              <div class="relative shrink-0 sm:text-right"><small class="text-muted">Complete tray</small><strong class="block text-2xl text-lilac">₹{{ trayTotal }}</strong></div>
            </div>
            <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div v-for="product in trayProducts" :key="product.id" class="rounded-2xl border border-line bg-canvas p-2.5 text-ink">
                <img class="aspect-square w-full rounded-xl object-cover" :src="`/assets/img/product/${product.imgf}`" :alt="product.title" />
                <p class="mt-3 line-clamp-2 min-h-10 text-sm leading-5 font-semibold">{{ product.title }}</p>
                <p class="mt-1 text-sm font-bold text-lilac">₹{{ product.price.max }}</p>
              </div>
            </div>
            <button class="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-lilac font-semibold text-white hover:-translate-y-0.5 hover:bg-lilac-dark" @click="addTray">
              <Plus :size="18" /> Add the complete tray
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </section>

  <section class="section-space bg-canvas">
    <div class="page-shell">
      <div class="overflow-hidden rounded-xl border border-line bg-white shadow-card lg:grid lg:grid-cols-[.78fr_1.22fr]">
        <div class="relative min-h-[390px] overflow-hidden bg-[#211a20] p-7 text-white sm:p-10 lg:min-h-[560px] lg:p-12">
          <div class="absolute -top-20 -right-20 size-72 rounded-full border border-white/8"></div>
          <div class="absolute right-10 bottom-10 size-44 overflow-hidden rounded-full border-8 border-white/8">
            <img class="h-full w-full object-cover" src="/assets/img/product/ai/ai-product-38.jpg" alt="Lilac dining experience" />
          </div>
          <div class="absolute right-37 bottom-32 size-24 overflow-hidden rounded-full border-6 border-white/8">
            <img class="h-full w-full object-cover" src="/assets/img/product/ai/ai-product-45.jpg" alt="Lilac dessert" />
          </div>
          <div class="relative max-w-sm">
            <p class="text-xs font-bold tracking-[.2em] text-white/55 uppercase">Guest notes</p>
            <h2 class="mt-5 text-4xl leading-[1.05] font-semibold tracking-[-.05em] sm:text-5xl">What our guests say</h2>
            <p class="mt-5 leading-7 text-white/58">Stories of warm meals, thoughtful service, and stays that felt a little more personal.</p>
          </div>
          <div class="absolute bottom-8 left-7 flex items-center gap-3 sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12">
            <button class="grid size-11 place-items-center rounded-full border border-white/18 hover:bg-white hover:text-ink" aria-label="Previous guest note" @click="previousTestimonial"><ArrowLeft :size="17" /></button>
            <span class="min-w-16 text-center text-sm font-semibold">{{ String(testimonialIndex + 1).padStart(2, '0') }} / {{ String(testimonials.length).padStart(2, '0') }}</span>
            <button class="grid size-11 place-items-center rounded-full border border-white/18 hover:bg-white hover:text-ink" aria-label="Next guest note" @click="nextTestimonial"><ArrowRight :size="17" /></button>
          </div>
        </div>

        <div class="flex min-h-[500px] items-center p-7 sm:p-10 lg:min-h-[560px] lg:p-14">
          <Transition name="testimonial" mode="out-in">
            <article :key="currentTestimonial.id" class="relative w-full">
              <Quote class="text-lilac/12" :size="56" />
              <div class="mt-6 flex gap-1 text-[#b57a13]"><Star v-for="star in 5" :key="star" :size="15" fill="currentColor" /></div>
              <blockquote class="mt-7 text-xl leading-9 font-medium tracking-[-.02em] text-ink sm:text-2xl sm:leading-10 lg:text-[1.7rem] lg:leading-11">{{ currentTestimonial.text }}</blockquote>
              <div class="mt-9 flex items-center gap-4 border-t border-line pt-6">
                <span class="grid size-13 place-items-center rounded-full bg-lilac text-lg font-semibold text-white">{{ currentTestimonial.name.charAt(0) }}</span>
                <div><strong class="text-base">{{ currentTestimonial.name }}</strong><small class="mt-1 block text-muted">{{ currentTestimonial.title }}</small></div>
                <span class="ml-auto hidden items-center gap-2 rounded-full bg-lilac-soft px-3 py-1.5 text-xs font-semibold text-lilac sm:inline-flex"><Check :size="13" /> Guest note</span>
              </div>
            </article>
          </Transition>
        </div>
      </div>
    </div>
  </section>

  <section class="relative flex min-h-[520px] items-center overflow-hidden bg-[#211a20] text-white lg:h-[590px] lg:min-h-0">
    <img class="absolute inset-0 h-full w-full object-cover" src="/assets/img/product/ai/ai-product-26.jpg" alt="Paneer butter masala prepared by Lilac Hotels" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#211a20] via-[#211a20]/85 to-[#211a20]/12"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(120,38,113,.7),transparent_35%)]"></div>
    <div class="page-shell relative py-12">
      <div class="max-w-3xl">
        <span class="inline-flex size-14 items-center justify-center rounded-full border border-white/18 bg-white/8 backdrop-blur"><UtensilsCrossed :size="24" /></span>
        <p class="mt-8 text-xs font-bold tracking-[.22em] text-white/55 uppercase">Your evening, beautifully considered</p>
        <h2 class="mt-5 text-[clamp(2.8rem,6vw,5.25rem)] leading-[.9] font-semibold tracking-[-.07em]">Stay in.<br />Dine beautifully.</h2>
        <p class="mt-7 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">Seventy dishes, one thoughtfully designed menu, and the quiet luxury of having it brought to your room.</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <RouterLink class="inline-flex min-h-13 items-center gap-2 rounded-lg bg-white px-7 font-semibold text-lilac hover:-translate-y-0.5 hover:bg-lilac-soft" to="/product">Open the dining menu <ArrowRight :size="18" /></RouterLink>
          <a class="inline-flex min-h-13 items-center rounded-lg border border-white/20 px-6 font-semibold text-white backdrop-blur hover:bg-white/10" href="tel:08065551244">Speak with dining</a>
        </div>
      </div>
      <div class="absolute right-8 bottom-8 hidden items-center gap-3 border-l border-white/20 pl-5 text-sm text-white/55 lg:flex"><Clock3 :size="18" /><span>Available daily<br /><strong class="text-white">7:30 AM–10:30 PM</strong></span></div>
    </div>
  </section>
</template>
