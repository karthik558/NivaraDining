<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu, Search, ShoppingBag, Heart, UserRound, X, Minus, Plus,
  Phone, Clock3, ArrowRight, Mail, ChevronRight, Trash2,
} from '@lucide/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import {
  cartCount, cartDiscount, cartSubtotal, cartTax, cartTotal,
  removeFromCart, state, updateQuantity,
} from '../store'

const router = useRouter()
const mobileOpen = ref(false)
const search = ref('')

const submitSearch = () => {
  state.search = search.value.trim()
  mobileOpen.value = false
  router.push({ path: '/product', query: state.search ? { q: state.search } : {}, hash: '#menu-results' })
}

const closeMobileNav = () => {
  mobileOpen.value = false
}

const handleEscape = (event) => {
  if (event.key === 'Escape') closeMobileNav()
}

watch(mobileOpen, (isOpen) => {
  document.body.classList.toggle('nav-open', isOpen)
  if (isOpen) document.addEventListener('keydown', handleEscape)
  else document.removeEventListener('keydown', handleEscape)
})

const removeRouteGuard = router.afterEach(closeMobileNav)

onBeforeUnmount(() => {
  document.body.classList.remove('nav-open')
  document.removeEventListener('keydown', handleEscape)
  removeRouteGuard()
})
</script>

<template>
  <div class="min-h-screen">
    <header class="relative z-40">
      <div class="bg-lilac py-2.5 text-white">
        <div class="page-shell flex items-center justify-center text-[11px] sm:justify-between sm:text-sm">
          <p class="hidden sm:block">In-room dining, thoughtfully prepared</p>
          <div class="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-5">
            <span class="flex items-center gap-1.5 whitespace-nowrap"><Clock3 :size="13" /> <span class="sm:hidden">7:30 AM–10:30 PM</span><span class="hidden sm:inline">Daily · 7:30 AM–10:30 PM</span></span>
            <a class="flex items-center gap-1.5 hover:text-white/80" href="tel:08065551244">
              <Phone :size="13" /> <span class="whitespace-nowrap">080 6555 1244</span>
            </a>
          </div>
        </div>
      </div>

      <div class="border-b border-line bg-white/95 shadow-[0_8px_30px_rgba(33,29,32,.04)] backdrop-blur-xl">
        <div class="page-shell grid min-h-17 grid-cols-[44px_1fr_44px] items-center gap-2 sm:min-h-20 sm:grid-cols-[44px_auto_1fr_auto] sm:gap-4 lg:flex lg:min-h-24">
          <button class="icon-button xl:hidden" type="button" aria-label="Open navigation" aria-controls="mobile-navigation" :aria-expanded="mobileOpen" @click="mobileOpen = true">
            <Menu :size="20" />
          </button>
          <RouterLink to="/" class="mx-auto shrink-0 sm:mx-0" aria-label="Lilac Hotels home">
            <img class="h-12 w-25 object-contain sm:h-14 sm:w-28 lg:h-18 lg:w-40" src="/assets/img/logo/logo.png" alt="Lilac Hotels" />
          </RouterLink>

          <nav class="mx-4 hidden shrink-0 items-center gap-1 rounded-xl border border-line bg-canvas p-1.5 text-sm font-semibold xl:flex" aria-label="Primary">
            <RouterLink to="/" class="desktop-nav-link">Home</RouterLink>
            <RouterLink to="/product" class="desktop-nav-link">Dining menu</RouterLink>
            <RouterLink to="/contact" class="desktop-nav-link">Contacts</RouterLink>
          </nav>

          <form class="relative ml-auto hidden w-full max-w-64 md:block xl:max-w-72" role="search" @submit.prevent="submitSearch">
            <label class="sr-only" for="site-search">Search the menu</label>
            <input id="site-search" v-model="search" class="field rounded-lg pr-12" type="search" placeholder="Search the menu" />
            <button class="absolute top-1 right-1 grid size-10 place-items-center rounded-lg bg-lilac text-white" aria-label="Search">
              <Search :size="17" />
            </button>
          </form>

          <div class="flex items-center justify-end gap-2">
            <RouterLink class="icon-button hidden sm:grid" to="/sign-in" aria-label="Sign in"><UserRound :size="18" /></RouterLink>
            <RouterLink class="icon-button hidden xl:grid" to="/wishlist" aria-label="Saved items">
              <Heart :size="18" />
              <span v-if="state.wishlist.length" class="absolute -top-1 -right-1 grid size-5 place-items-center rounded-md bg-lilac text-[10px] font-bold text-white">{{ state.wishlist.length }}</span>
            </RouterLink>
            <RouterLink class="hidden min-h-12 shrink-0 items-center gap-3 rounded-lg bg-lilac py-2 pr-5 pl-3 font-semibold text-white hover:-translate-y-0.5 hover:bg-lilac-dark xl:inline-flex" to="/cart" aria-label="View cart">
              <span class="relative grid size-8 place-items-center rounded-md bg-white/14">
                <ShoppingBag :size="17" />
                <span v-if="cartCount" class="absolute -top-2 -right-2 grid size-5 place-items-center rounded-md bg-white text-[10px] font-bold text-lilac">{{ cartCount }}</span>
              </span>
              <span><small class="block text-[10px] leading-none font-medium text-white/60">Your order</small>View cart</span>
            </RouterLink>
            <button class="icon-button rounded-lg! xl:hidden" type="button" aria-label="Open cart" @click="state.cartOpen = true">
              <ShoppingBag :size="18" />
              <span v-if="cartCount" class="absolute -top-1 -right-1 grid size-5 place-items-center rounded-md bg-lilac text-[10px] font-bold text-white">{{ cartCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <Transition name="mobile-nav">
      <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" @click.self="closeMobileNav">
        <aside id="mobile-navigation" class="mobile-nav-panel flex h-full w-[min(88vw,380px)] flex-col overflow-y-auto bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="Main navigation">
          <div class="flex items-center justify-between border-b border-line px-5 py-3">
            <RouterLink to="/" aria-label="Lilac Hotels home">
              <img class="h-13 w-27 object-contain object-left" src="/assets/img/logo/logo.png" alt="Lilac Hotels" />
            </RouterLink>
            <button class="icon-button" type="button" aria-label="Close navigation" @click="closeMobileNav"><X :size="19" /></button>
          </div>

          <div class="flex flex-1 flex-col p-5">
            <form class="relative" role="search" @submit.prevent="submitSearch">
              <label class="sr-only" for="mobile-site-search">Search the menu</label>
              <input id="mobile-site-search" v-model="search" class="field rounded-lg pr-12" type="search" placeholder="Search the menu" />
              <button class="absolute top-1 right-1 grid size-10 place-items-center rounded-lg bg-lilac text-white" aria-label="Search"><Search :size="17" /></button>
            </form>

            <p class="mt-7 px-3 text-[11px] font-bold tracking-[.16em] text-muted uppercase">Explore</p>
            <nav class="mt-2 grid gap-1 text-[17px] font-semibold" aria-label="Mobile primary">
              <RouterLink v-for="link in [{to:'/',label:'Home'},{to:'/product',label:'Dining menu'},{to:'/contact',label:'Contact'}]" :key="link.to" :to="link.to" class="mobile-nav-link">
                <span>{{ link.label }}</span><ChevronRight :size="18" />
              </RouterLink>
            </nav>

            <div class="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
              <RouterLink class="mobile-nav-shortcut" to="/wishlist">
                <Heart :size="19" /><span>Saved items</span>
                <span v-if="state.wishlist.length" class="ml-auto grid size-5 place-items-center rounded-full bg-lilac text-[10px] text-white">{{ state.wishlist.length }}</span>
              </RouterLink>
              <RouterLink class="mobile-nav-shortcut" to="/sign-in"><UserRound :size="19" /><span>Sign in</span></RouterLink>
            </div>

            <a href="tel:08065551244" class="mt-auto flex items-center gap-3 rounded-2xl bg-lilac-soft p-4 text-lilac">
              <span class="grid size-10 shrink-0 place-items-center rounded-full bg-white"><Phone :size="18" /></span>
              <span><small class="block text-muted">Dining assistance</small><strong>080 6555 1244</strong></span>
            </a>
          </div>
        </aside>
      </div>
    </Transition>

    <main class="min-h-[60vh]">
      <RouterView />
    </main>

    <footer class="relative bg-[#1e181d] pt-12 text-white">
      <div class="page-shell relative z-10">
        <div class="overflow-hidden rounded-xl bg-lilac shadow-[0_24px_70px_rgba(48,16,44,.3)]">
          <div class="grid items-center gap-7 px-6 py-8 sm:px-9 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-10">
            <div><p class="text-xs font-bold tracking-[.18em] text-white/60 uppercase">Dining at Lilac</p><h2 class="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Ready whenever you are.</h2><p class="mt-2 text-white/65">Explore the full menu or speak with our dining team.</p></div>
            <div class="flex flex-wrap gap-3">
              <RouterLink class="inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-6 font-semibold text-lilac hover:-translate-y-0.5 hover:bg-lilac-soft" to="/product">View dining menu <ArrowRight :size="17" /></RouterLink>
              <a class="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 px-5 font-semibold text-white hover:bg-white/10" href="tel:08065551244"><Phone :size="17" /> Call dining</a>
            </div>
          </div>
        </div>
      </div>

      <div class="page-shell grid gap-10 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        <div class="sm:col-span-2 lg:col-span-4">
          <img class="h-24 w-42 object-contain object-left" src="/assets/img/logo/logo-white.png" alt="Lilac Hotels" />
          <p class="mt-5 max-w-sm leading-7 text-white/55">Thoughtful stays, warm hospitality, and food prepared to make your room feel a little more like your own.</p>
          <div class="mt-7 flex gap-2">
            <a class="footer-social" href="https://www.instagram.com/lilachotels/" target="_blank" rel="noreferrer" aria-label="Lilac Hotels on Instagram"><FontAwesomeIcon :icon="faInstagram" /></a>
            <a class="footer-social" href="https://www.facebook.com/LilacHotels/" target="_blank" rel="noreferrer" aria-label="Lilac Hotels on Facebook"><FontAwesomeIcon :icon="faFacebookF" /></a>
            <a class="footer-social" href="https://www.linkedin.com/company/tamara-leisure-experiences/" target="_blank" rel="noreferrer" aria-label="Tamara Leisure Experiences on LinkedIn"><FontAwesomeIcon :icon="faLinkedinIn" /></a>
          </div>
        </div>

        <div class="lg:col-span-2 lg:col-start-6">
          <h2 class="text-sm font-semibold tracking-wide">Explore</h2>
          <nav class="mt-5 grid gap-3.5 text-sm text-white/50">
            <RouterLink class="footer-link" to="/">Home</RouterLink>
            <RouterLink class="footer-link" to="/product">Dining menu</RouterLink>
            <RouterLink class="footer-link" to="/wishlist">Saved items</RouterLink>
            <RouterLink class="footer-link" to="/cart">Your order</RouterLink>
          </nav>
        </div>

        <div class="lg:col-span-2">
          <h2 class="text-sm font-semibold tracking-wide">Lilac stays</h2>
          <div class="mt-5 grid gap-3.5 text-sm text-white/50">
            <span>Lilac Guruvayur</span><span>Lilac Kumbakonam</span><span>O by Tamara</span><span>The Tamara</span>
          </div>
        </div>

        <div class="sm:col-span-2 lg:col-span-3">
          <h2 class="text-sm font-semibold tracking-wide">Guest assistance</h2>
          <div class="mt-5 grid gap-4 text-sm">
            <a class="flex items-center gap-3 text-white/55 hover:text-white" href="tel:08065551244"><span class="grid size-9 place-items-center rounded-full bg-white/7 text-white"><Phone :size="15" /></span><span><small class="block text-white/35">Call us</small>080 6555 1244</span></a>
            <a class="flex items-center gap-3 text-white/55 hover:text-white" href="mailto:reservations@lilachotels.com"><span class="grid size-9 place-items-center rounded-full bg-white/7 text-white"><Mail :size="15" /></span><span class="min-w-0"><small class="block text-white/35">Email</small><span class="break-all">reservations@lilachotels.com</span></span></a>
            <div class="flex items-center gap-3 text-white/55"><span class="grid size-9 place-items-center rounded-full bg-white/7 text-white"><Clock3 :size="15" /></span><span><small class="block text-white/35">Dining hours</small>7:30 AM–10:30 PM</span></div>
          </div>
        </div>
      </div>

      <div class="border-t border-white/8">
        <div class="page-shell flex flex-col gap-3 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {{ new Date().getFullYear() }} Lilac Hotels. All rights reserved.</span>
          <div class="flex gap-5"><a class="hover:text-white" href="https://lilachotels.com/privacy/" target="_blank" rel="noreferrer">Privacy</a><RouterLink class="hover:text-white" to="/contact">Contacts</RouterLink></div>
        </div>
      </div>
    </footer>

    <Transition name="fade">
      <div v-if="state.cartOpen" class="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm" @click.self="state.cartOpen = false">
        <aside class="ml-auto flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl sm:p-7">
          <div class="flex items-center justify-between">
            <div><p class="eyebrow">Your order</p><h2 class="mt-1 text-2xl font-semibold">{{ cartCount }} item{{ cartCount === 1 ? '' : 's' }}</h2></div>
            <button class="icon-button" aria-label="Close cart" @click="state.cartOpen = false"><X :size="19" /></button>
          </div>
          <div v-if="state.cart.length" class="mt-7 flex-1 space-y-4 overflow-y-auto pr-1">
            <article v-for="item in state.cart" :key="item.id" class="flex gap-4 rounded-2xl border border-line p-3">
              <img class="size-20 rounded-xl object-cover" :src="`/assets/img/product/${item.imgf}`" :alt="item.title" />
              <div class="min-w-0 flex-1">
                <h3 class="truncate font-semibold">{{ item.title }}</h3>
                <p class="mt-1 font-bold text-lilac">₹{{ item.price.max }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <button class="grid size-7 place-items-center rounded-full border border-line" @click="updateQuantity(item.id, item.qty - 1)"><Minus :size="13" /></button>
                  <span class="w-5 text-center text-sm">{{ item.qty }}</span>
                  <button class="grid size-7 place-items-center rounded-full border border-line" @click="updateQuantity(item.id, item.qty + 1)"><Plus :size="13" /></button>
                  <button class="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-500 hover:text-white" @click="removeFromCart(item.id)"><Trash2 :size="13" /> Remove</button>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="grid flex-1 place-items-center text-center">
            <div><ShoppingBag class="mx-auto text-lilac" :size="38" /><h3 class="mt-4 text-xl font-semibold">Your order is empty</h3><p class="mt-2 text-sm text-muted">Explore the menu to add something delicious.</p></div>
          </div>
          <div v-if="state.cart.length" class="mt-6 border-t border-line pt-5">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-muted"><span>Subtotal</span><span class="text-ink">₹{{ cartSubtotal.toFixed(2) }}</span></div>
              <div v-if="cartDiscount" class="flex justify-between text-green-700"><span>Coupon</span><span>−₹{{ cartDiscount.toFixed(2) }}</span></div>
              <div class="flex justify-between text-muted"><span>GST (18%)</span><span class="text-ink">₹{{ cartTax.toFixed(2) }}</span></div>
              <div class="flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>Total</span><span>₹{{ cartTotal.toFixed(2) }}</span></div>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-3">
              <RouterLink class="secondary-button px-3!" to="/cart" @click="state.cartOpen = false">View cart</RouterLink>
              <RouterLink class="primary-button px-3!" to="/checkout" @click="state.cartOpen = false">Checkout <ArrowRight :size="16" /></RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="state.toast" class="fixed right-4 bottom-5 z-[60] max-w-sm rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl sm:right-6">{{ state.toast }}</div>
    </Transition>
  </div>
</template>
