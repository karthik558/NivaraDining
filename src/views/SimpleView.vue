<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRight, CheckCircle, ChevronDown, Clock3, ConciergeBell, Cookie,
  FileText, Heart, Lock, Mail, MapPin, MessageCircle, Phone, RotateCcw,
  ShieldCheck,
} from '@lucide/vue'
import ProductCard from '../components/ProductCard.vue'
import { state } from '../store'

const route = useRoute()
const router = useRouter()
const page = computed(() => route.meta.page)
const sent = ref(false)
const faqOpen = ref(0)
const error = ref('')
const showPassword = ref(false)
const contact = reactive({ name: '', email: '', room: '', topic: 'Dining assistance', message: '' })
const login = reactive({ username: '', password: '' })
const signIn = () => {
  error.value = ''
  if (login.username.toLowerCase() === 'admin' && login.password === 'admin') {
    localStorage.setItem('currentAdminUser', JSON.stringify({ username: 'admin', role: 'super_admin' }))
    router.push('/admin')
  } else error.value = 'Those details do not match. Use the administrator credentials provided below.'
}
</script>

<template>
  <template v-if="page === 'wishlist'">
    <section class="relative overflow-hidden bg-[#211a20] py-14 text-white lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(120,38,113,.75),transparent_40%)]"></div>
      <div class="page-shell relative">
        <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">Saved Favorites</p></div>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Saved Culinary Items</h1>
        <p class="mt-4 max-w-2xl text-lg text-white/65">Your saved menu selections for effortless ordering during your stay.</p>
      </div>
    </section>
    <section class="section-space"><div class="page-shell">
      <div v-if="state.wishlist.length" class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"><ProductCard v-for="product in state.wishlist" :key="product.id" :product="product" /></div>
      <div v-else class="surface grid min-h-96 place-items-center p-8 text-center"><div><span class="mx-auto grid size-16 place-items-center rounded-full bg-lilac-soft text-lilac"><Heart :size="28" /></span><h2 class="mt-5 text-2xl font-semibold">Nothing saved yet</h2><p class="mt-2 text-muted">Tap the heart on any dish to keep it here.</p><RouterLink class="primary-button mt-6" to="/product">Browse the menu</RouterLink></div></div>
    </div></section>
  </template>

  <template v-else-if="page === 'contact'">
    <section class="relative min-h-162.5 overflow-hidden bg-[#142420] text-white lg:min-h-180">
      <img class="absolute inset-0 h-full w-full object-cover object-center lg:object-right" src="/assets/img/product/ai/ai-product-23.jpg" alt="Nivara Hotels guest assistance" />
      <div class="absolute inset-0 bg-linear-to-r from-[#142420] via-[#142420]/90 to-[#142420]/18"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(18,78,63,.7),transparent_38%)]"></div>
      <div class="page-shell relative flex min-h-162.5 items-center py-16 lg:min-h-180">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">Guest assistance</p></div>
          <h1 class="mt-6 text-[clamp(3.7rem,8vw,7.2rem)] leading-[.9] font-semibold tracking-tighter font-serif">We’re here<br />for your stay.</h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-white/65">Whether you need help choosing a dish, have a dietary request, or simply want to speak with someone, our team is close by.</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a class="inline-flex min-h-13 items-center gap-2 rounded-lg bg-white px-6 font-semibold text-lilac hover:-translate-y-0.5" href="tel:9999999999"><Phone :size="17" /> Call guest assistance</a>
            <a class="inline-flex min-h-13 items-center gap-2 rounded-lg border border-white/20 px-6 font-semibold text-white hover:bg-white/10" href="mailto:reservations@nivarahotels.com"><Mail :size="17" /> Send an email</a>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 -mt-8">
      <div class="page-shell grid gap-3 md:grid-cols-3">
        <a class="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card hover:-translate-y-1 hover:border-lilac/30" href="tel:9999999999">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><Phone :size="19" /></span><span><small class="text-muted">Call us directly</small><strong class="mt-0.5 block">+91 99999 99999</strong></span>
        </a>
        <a class="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card hover:-translate-y-1 hover:border-lilac/30" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><MessageCircle :size="19" /></span><span><small class="text-muted">Chat about an order</small><strong class="mt-0.5 block">Open WhatsApp</strong></span>
        </a>
        <div class="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><Clock3 :size="19" /></span><span><small class="text-muted">Dining assistance</small><strong class="mt-0.5 block">7:30 AM–10:30 PM</strong></span>
        </div>
      </div>
    </section>

    <section class="section-space">
      <div class="page-shell grid gap-10 lg:grid-cols-[.76fr_1.24fr] lg:gap-16">
        <div class="lg:py-8">
          <p class="eyebrow">A thoughtful response</p>
          <h2 class="section-title mt-3">Tell us what would make your stay better.</h2>
          <p class="mt-5 max-w-md leading-7 text-muted">Share as much or as little as you like. For immediate dining assistance, calling the team will always be the quickest option.</p>
          <div class="mt-9 space-y-5 border-t border-line pt-7">
            <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><ConciergeBell :size="18" /></span><div><strong>In-room dining</strong><p class="mt-1 text-sm leading-6 text-muted">Menu guidance, allergens, modifications, and order updates.</p></div></div>
            <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><MapPin :size="18" /></span><div><strong>During your stay</strong><p class="mt-1 text-sm leading-6 text-muted">Room-side assistance coordinated with the Nivara team.</p></div></div>
          </div>
        </div>

        <form class="relative overflow-hidden rounded-xl border border-line bg-white p-6 shadow-card sm:p-9" @submit.prevent="sent = true">
          <div class="absolute top-0 right-0 size-40 rounded-bl-full bg-lilac-soft"></div>
          <div class="relative">
            <p class="eyebrow">Send a note</p><h2 class="mt-2 text-3xl font-semibold tracking-[-.035em] font-serif">How can we help?</h2>
            <p v-if="sent" class="mt-5 rounded-xl bg-green-50 p-4 text-green-800">Thank you. Your message has been received and our team will get back to you shortly.</p>
            <div class="mt-7 grid gap-5 sm:grid-cols-2">
              <label class="grid gap-2 text-sm font-semibold">Your name<input v-model="contact.name" class="field" autocomplete="name" required /></label>
              <label class="grid gap-2 text-sm font-semibold">Email address<input v-model="contact.email" class="field" type="email" autocomplete="email" required /></label>
              <label class="grid gap-2 text-sm font-semibold">Room number <span class="font-normal text-muted">(optional)</span><input v-model="contact.room" class="field" inputmode="numeric" /></label>
              <label class="grid gap-2 text-sm font-semibold">Topic<select v-model="contact.topic" class="field"><option>Dining assistance</option><option>Dietary request</option><option>Order update</option><option>General feedback</option></select></label>
              <label class="grid gap-2 text-sm font-semibold sm:col-span-2">Your message<textarea v-model="contact.message" class="field min-h-36 resize-y py-3" placeholder="Tell us how we can help…" required></textarea></label>
            </div>
            <button class="primary-button mt-7">Send your message <ArrowRight :size="17" /></button>
          </div>
        </form>
      </div>
    </section>

    <section class="section-space bg-warm">
      <div class="page-shell grid gap-9 lg:grid-cols-[.7fr_1.3fr]">
        <div><p class="eyebrow">Good to know</p><h2 class="section-title mt-3">A few quick answers.</h2><p class="mt-4 text-muted">Helpful details before you get in touch.</p></div>
        <div class="divide-y divide-line border-y border-line">
          <div v-for="(item, index) in [
            { q: 'When is in-room dining available?', a: 'Our dining menu is available every day from 7:30 AM until 10:30 PM.' },
            { q: 'Can dishes be adjusted for dietary needs?', a: 'Yes. Please call the dining team before ordering so we can guide you through suitable options and kitchen considerations.' },
            { q: 'How do I check the status of my order?', a: 'Call +91 99999 99999 or open WhatsApp and share your room number with the team.' },
            { q: 'Where will my order be delivered?', a: 'Orders are delivered directly to the room number provided during checkout.' }
          ]" :key="item.q" class="py-5">
            <button class="flex w-full items-center justify-between gap-4 text-left font-semibold" :aria-expanded="faqOpen === index" @click="faqOpen = faqOpen === index ? -1 : index"><span>{{ item.q }}</span><ChevronDown class="shrink-0 duration-200" :class="{ 'rotate-180': faqOpen === index }" :size="18" /></button>
            <Transition name="fade"><p v-if="faqOpen === index" class="max-w-2xl pt-4 leading-7 text-muted">{{ item.a }}</p></Transition>
          </div>
        </div>
      </div>
    </section>
  </template>

  <template v-else-if="page === 'sign-in'">
    <section class="relative overflow-hidden bg-canvas py-10 sm:py-14 lg:py-18">
      <div class="absolute -top-48 right-0 size-120 rounded-full bg-lilac/7 blur-3xl"></div>
      <div class="page-shell relative">
        <div class="mx-auto grid max-w-275 overflow-hidden rounded-lg border border-line bg-white shadow-[0_28px_80px_rgba(41,26,38,.12)] lg:min-h-160 lg:grid-cols-[.9fr_1.1fr]">
          <div class="relative min-h-60 overflow-hidden bg-ink sm:min-h-80 lg:min-h-full">
            <img class="absolute inset-0 h-full w-full object-cover" src="/assets/img/product/ai/ai-product-38.jpg" alt="Nivara Hotels dining service" />
            <div class="absolute inset-0 bg-linear-to-t from-ink/25 to-transparent lg:bg-linear-to-r"></div>
          </div>

          <form class="flex flex-col justify-center p-6 sm:p-10 lg:p-12" @submit.prevent="signIn">
            <h1 class="text-3xl font-semibold tracking-[-.035em] font-serif">Sign in</h1>
            <p class="mt-3 max-w-md text-sm leading-6 text-muted">Enter your administrator credentials to continue.</p>

            <p v-if="error" class="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">{{ error }}</p>

            <div class="mt-7 grid gap-5">
              <label class="grid gap-2 text-sm font-semibold">Username
                <input v-model="login.username" class="field" autocomplete="username" placeholder="Enter username" required />
              </label>
              <label class="grid gap-2 text-sm font-semibold">Password
                <span class="relative"><input v-model="login.password" class="field pr-18" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter password" required /><button class="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-lilac hover:text-ink" type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button></span>
              </label>
            </div>

            <button class="primary-button mt-7 w-full">Sign in</button>

            <div class="mt-5 rounded-lg border border-lilac/12 bg-lilac-soft/55 p-4 text-sm">
              <span><small class="block text-muted">Demo credentials</small><strong>admin</strong> <span class="text-muted">/</span> <strong>admin</strong></span>
            </div>

            <RouterLink class="mt-6 text-center text-sm font-semibold text-muted hover:text-lilac" to="/">Return to dining website</RouterLink>
          </form>
        </div>
      </div>
    </section>
  </template>

  <!-- Policy Sticky Sub-Navigation Bar for legal pages -->
  <template v-if="['privacy-policy', 'cookies-policy', 'refund-policy', 'terms'].includes(page)">
    <section class="relative overflow-hidden bg-[#142420] py-14 text-white lg:py-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(18,78,63,.75),transparent_40%)]"></div>
      <div class="page-shell relative">
        <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">Legal & Compliance</p></div>
        <h1 v-if="page === 'privacy-policy'" class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Privacy Policy</h1>
        <h1 v-else-if="page === 'cookies-policy'" class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Cookies &amp; Local Storage</h1>
        <h1 v-else-if="page === 'refund-policy'" class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Refund &amp; Cancellation</h1>
        <h1 v-else-if="page === 'terms'" class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Terms &amp; Conditions</h1>
        
        <p v-if="page === 'privacy-policy'" class="mt-4 max-w-2xl text-lg text-white/65">How Nivara Hotels &amp; Stays collects, uses, and safeguards your personal data during your stay.</p>
        <p v-else-if="page === 'cookies-policy'" class="mt-4 max-w-2xl text-lg text-white/65">Understanding how browser storage technologies preserve your active dining cart and saved dishes.</p>
        <p v-else-if="page === 'refund-policy'" class="mt-4 max-w-2xl text-lg text-white/65">Our guest commitment to culinary quality assurance, order cancellations, and room billing credits.</p>
        <p v-else-if="page === 'terms'" class="mt-4 max-w-2xl text-lg text-white/65">Standard terms and conditions governing in-room dining services provided across Nivara properties.</p>
        <p class="mt-3 text-xs font-semibold text-white/45">Effective Date: January 2026 · Version 2.0</p>
      </div>
    </section>

    <!-- Top Policy Tabs Switcher Bar -->
    <div class="sticky top-20 z-30 border-b border-line bg-white/95 shadow-xs backdrop-blur-md">
      <div class="page-shell flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-sm font-semibold">
        <RouterLink to="/privacy-policy" class="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 transition-all" :class="page === 'privacy-policy' ? 'bg-lilac text-white shadow-sm' : 'text-muted hover:bg-lilac-soft hover:text-lilac'">
          <ShieldCheck :size="16" /> Privacy Policy
        </RouterLink>
        <RouterLink to="/cookies-policy" class="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 transition-all" :class="page === 'cookies-policy' ? 'bg-lilac text-white shadow-sm' : 'text-muted hover:bg-lilac-soft hover:text-lilac'">
          <Cookie :size="16" /> Cookies Policy
        </RouterLink>
        <RouterLink to="/refund-policy" class="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 transition-all" :class="page === 'refund-policy' ? 'bg-lilac text-white shadow-sm' : 'text-muted hover:bg-lilac-soft hover:text-lilac'">
          <RotateCcw :size="16" /> Refund &amp; Cancellation
        </RouterLink>
        <RouterLink to="/terms" class="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 transition-all" :class="page === 'terms' ? 'bg-lilac text-white shadow-sm' : 'text-muted hover:bg-lilac-soft hover:text-lilac'">
          <FileText :size="16" /> Terms &amp; Conditions
        </RouterLink>
      </div>
    </div>

    <!-- Unified Policy Page Content -->
    <section class="section-space">
      <div class="page-shell grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        <!-- Sidebar Navigation & Concierge Contact -->
        <aside class="hidden lg:block">
          <div class="sticky top-36 space-y-5">
            <div class="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 class="text-xs font-bold tracking-wider text-muted uppercase">On This Page</h2>
              <nav v-if="page === 'privacy-policy'" class="mt-4 grid gap-2.5 text-sm font-semibold text-ink">
                <a href="#privacy-1" class="hover:text-lilac">1. Information We Collect</a>
                <a href="#privacy-2" class="hover:text-lilac">2. How Data Is Used</a>
                <a href="#privacy-3" class="hover:text-lilac">3. Security &amp; Encryption</a>
                <a href="#privacy-4" class="hover:text-lilac">4. Non-Disclosure Guarantee</a>
                <a href="#privacy-5" class="hover:text-lilac">5. Guest Privacy Rights</a>
              </nav>
              <nav v-else-if="page === 'cookies-policy'" class="mt-4 grid gap-2.5 text-sm font-semibold text-ink">
                <a href="#cookies-1" class="hover:text-lilac">1. Web Storage Concept</a>
                <a href="#cookies-2" class="hover:text-lilac">2. Active Storage Breakdown</a>
                <a href="#cookies-3" class="hover:text-lilac">3. Managing Preferences</a>
              </nav>
              <nav v-else-if="page === 'refund-policy'" class="mt-4 grid gap-2.5 text-sm font-semibold text-ink">
                <a href="#refund-1" class="hover:text-lilac">1. 5-Min Free Cancellation</a>
                <a href="#refund-2" class="hover:text-lilac">2. Quality &amp; Dish Replacement</a>
                <a href="#refund-3" class="hover:text-lilac">3. Folio Credits &amp; Timelines</a>
              </nav>
              <nav v-else-if="page === 'terms'" class="mt-4 grid gap-2.5 text-sm font-semibold text-ink">
                <a href="#terms-1" class="hover:text-lilac">1. Operating Schedule</a>
                <a href="#terms-2" class="hover:text-lilac">2. Delivery Verification</a>
                <a href="#terms-3" class="hover:text-lilac">3. Pricing &amp; 18% GST</a>
                <a href="#terms-4" class="hover:text-lilac">4. Allergen Advisory</a>
              </nav>
            </div>

            <div class="rounded-2xl border border-line bg-lilac-soft/60 p-5 text-sm">
              <p class="font-bold text-lilac">Need immediate assistance?</p>
              <p class="mt-1 text-xs leading-5 text-muted">Our guest concierge team is available 24/7 during your stay.</p>
              <a href="tel:9999999999" class="mt-3 inline-flex items-center gap-2 font-semibold text-ink hover:text-lilac">
                <Phone :size="15" /> +91 99999 99999
              </a>
            </div>
          </div>
        </aside>

        <!-- Main Article Container -->
        <article class="space-y-10 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">

          <!-- PRIVACY POLICY ARTICLE -->
          <div v-if="page === 'privacy-policy'" class="space-y-10">
            <section id="privacy-1" class="scroll-mt-36">
              <div class="flex items-center gap-3 text-lilac mb-3"><ShieldCheck :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">1. Information We Collect</h2></div>
              <p class="text-muted leading-7">To provide seamless in-room dining and guest concierge services, Nivara Hotels &amp; Stays collects minimal necessary personal details during your stay.</p>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-line p-4 bg-canvas/40"><strong>Guest Identity</strong><p class="mt-1 text-xs leading-5 text-muted">First name, last name, and registered room number.</p></div>
                <div class="rounded-xl border border-line p-4 bg-canvas/40"><strong>Contact Details</strong><p class="mt-1 text-xs leading-5 text-muted">Phone number and email address for order notifications.</p></div>
                <div class="rounded-xl border border-line p-4 bg-canvas/40"><strong>Order Data</strong><p class="mt-1 text-xs leading-5 text-muted">Selected dishes, custom dietary requests, and delivery instructions.</p></div>
                <div class="rounded-xl border border-line p-4 bg-canvas/40"><strong>Technical Data</strong><p class="mt-1 text-xs leading-5 text-muted">Browser session state (saved items, cart contents) stored locally.</p></div>
              </div>
            </section>

            <section id="privacy-2" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><ConciergeBell :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">2. How We Use Your Information</h2></div>
              <p class="text-muted leading-7">Your data is strictly used for room service delivery and order fulfillment within our properties:</p>
              <ul class="mt-4 space-y-3 text-sm text-muted">
                <li class="flex items-start gap-3"><CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" /><span>Delivering room service orders directly to your room number.</span></li>
                <li class="flex items-start gap-3"><CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" /><span>Sending real-time order status updates via SMS or WhatsApp messages.</span></li>
                <li class="flex items-start gap-3"><CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" /><span>Accommodating dietary preferences and culinary modifications requested by you.</span></li>
                <li class="flex items-start gap-3"><CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" /><span>Generating itemized PDF receipts and invoices for room billing.</span></li>
              </ul>
            </section>

            <section id="privacy-3" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><Lock :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">3. Security &amp; Encryption</h2></div>
              <p class="text-muted leading-7">We employ TLS 1.3 encryption protocols to safeguard data in transit between your device and our servers. Active cart items and wishlist selections remain stored strictly within your browser's private local memory.</p>
            </section>

            <section id="privacy-4" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><ShieldCheck :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">4. Non-Disclosure Guarantee</h2></div>
              <p class="text-muted leading-7">Nivara Hotels &amp; Stays <strong>never sells, rents, or trades</strong> guest information. Personal data is disclosed solely to authorized hotel staff (kitchen personnel and room service attendants) required to deliver your order.</p>
            </section>

            <section id="privacy-5" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><Mail :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">5. Your Privacy Rights</h2></div>
              <p class="text-muted leading-7">You may request access to, correction of, or deletion of your guest profile data recorded during your stay. Please contact Guest Relations at <a href="mailto:reservations@nivarahotels.com" class="font-semibold text-lilac">reservations@nivarahotels.com</a> or call <a href="tel:9999999999" class="font-semibold text-lilac">+91 99999 99999</a>.</p>
            </section>
          </div>

          <!-- COOKIES POLICY ARTICLE -->
          <div v-else-if="page === 'cookies-policy'" class="space-y-10">
            <section id="cookies-1" class="scroll-mt-36">
              <div class="flex items-center gap-3 text-lilac mb-3"><Cookie :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">1. What Are Cookies &amp; Local Storage?</h2></div>
              <p class="text-muted leading-7">Cookies and Web Local Storage are lightweight text data files stored in your web browser. They enable web applications to preserve your selected room service dishes and active preferences while browsing across pages.</p>
            </section>

            <section id="cookies-2" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><FileText :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">2. Storage Used on Nivara Dining</h2></div>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <div class="rounded-xl border border-line p-5">
                  <div class="flex items-center gap-2.5 font-bold text-lilac"><Cookie :size="19" /><span>Essential Order Cart</span></div>
                  <p class="mt-2 text-sm text-muted leading-6">Saves your room service selection (`state.cart`) so your order is preserved as you explore.</p>
                </div>
                <div class="rounded-xl border border-line p-5">
                  <div class="flex items-center gap-2.5 font-bold text-lilac"><Heart :size="19" /><span>Saved Wishlist Dishes</span></div>
                  <p class="mt-2 text-sm text-muted leading-6">Remembers favorite dishes (`state.wishlist`) marked with the heart icon for quick access.</p>
                </div>
                <div class="rounded-xl border border-line p-5">
                  <div class="flex items-center gap-2.5 font-bold text-lilac"><Lock :size="19" /><span>Admin Session Token</span></div>
                  <p class="mt-2 text-sm text-muted leading-6">Temporarily holds administrative status (`currentAdminUser`) during active staff management sessions.</p>
                </div>
                <div class="rounded-xl border border-line p-5">
                  <div class="flex items-center gap-2.5 font-bold text-lilac"><ShieldCheck :size="19" /><span>UI Preferences</span></div>
                  <p class="mt-2 text-sm text-muted leading-6">Stores active search queries and view mode preferences during your visit.</p>
                </div>
              </div>
            </section>

            <section id="cookies-3" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><RotateCcw :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">3. Managing Your Storage Preferences</h2></div>
              <p class="text-muted leading-7">You can clear or disable browser local storage at any time via your browser's Privacy/Security settings. Please note that clearing storage will reset your saved cart items and active wishlist favorites.</p>
            </section>
          </div>

          <!-- REFUND & CANCELLATION ARTICLE -->
          <div v-else-if="page === 'refund-policy'" class="space-y-10">
            <section id="refund-1" class="scroll-mt-36">
              <div class="flex items-center gap-3 text-lilac mb-3"><RotateCcw :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">1. 5-Minute Free Cancellation Window</h2></div>
              <p class="text-muted leading-7">In-room dining orders may be canceled without charge within <strong>5 minutes</strong> of placing the order, provided kitchen preparation has not begun. To cancel an active order immediately, please call Guest Concierge at <a href="tel:9999999999" class="font-semibold text-lilac">+91 99999 99999</a>.</p>
            </section>

            <section id="refund-2" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><CheckCircle :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">2. Quality Guarantee &amp; Dish Replacement</h2></div>
              <p class="text-muted leading-7">If an order delivered to your room does not meet Nivara’s culinary standards, arrives damaged, or contains incorrect items:</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-start gap-3 rounded-xl border border-line bg-canvas/40 p-4">
                  <CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" />
                  <div><strong>Instant Room Replacement:</strong> Our room service team will immediately prepare and deliver a fresh replacement dish to your door.</div>
                </div>
                <div class="flex items-start gap-3 rounded-xl border border-line bg-canvas/40 p-4">
                  <CheckCircle :size="18" class="text-lilac shrink-0 mt-0.5" />
                  <div><strong>Room Folio Credit:</strong> Alternatively, the charge for the affected dish will be removed from your room bill.</div>
                </div>
              </div>
            </section>

            <section id="refund-3" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><FileText :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">3. Refund Processing &amp; Billing Timelines</h2></div>
              <p class="text-muted leading-7">Approved refunds for digital prepaid orders will be processed back to your original payment method (Credit Card, Debit Card, UPI, Net Banking) within <strong>3 to 5 business days</strong>. For orders billed to your room, credit adjustments will be reflected immediately on your checkout folio.</p>
            </section>
          </div>

          <!-- TERMS & CONDITIONS ARTICLE -->
          <div v-else-if="page === 'terms'" class="space-y-10">
            <section id="terms-1" class="scroll-mt-36">
              <div class="flex items-center gap-3 text-lilac mb-3"><Clock3 :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">1. Operating Schedule</h2></div>
              <p class="text-muted leading-7">Nivara in-room dining service is available daily from <strong>7:30 AM to 10:30 PM</strong>. Orders placed outside operating hours will be scheduled for delivery during the next morning service window.</p>
            </section>

            <section id="terms-2" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><MapPin :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">2. Room Delivery &amp; Verification</h2></div>
              <p class="text-muted leading-7">Deliveries are made exclusively to registered guest room numbers provided at checkout. A registered occupant must be present inside the room to receive and verify the order upon arrival.</p>
            </section>

            <section id="terms-3" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><FileText :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">3. Pricing &amp; GST Taxes</h2></div>
              <p class="text-muted leading-7">All prices listed on the dining menu are in Indian Rupees (₹). Applicable Goods and Services Tax (18% GST) is added and itemized clearly prior to final order placement.</p>
            </section>

            <section id="terms-4" class="scroll-mt-36 border-t border-line pt-8">
              <div class="flex items-center gap-3 text-lilac mb-3"><ConciergeBell :size="24" /><h2 class="text-2xl font-bold tracking-tight text-ink font-serif">4. Dietary Restrictions &amp; Allergies</h2></div>
              <p class="text-muted leading-7">While our kitchens adhere to strict food safety guidelines, dishes are prepared in environments where common allergens (dairy, nuts, gluten) may be present. Guests with severe allergies must inform dining staff prior to ordering.</p>
            </section>
          </div>

        </article>
      </div>
    </section>
  </template>

  <section v-else class="grid min-h-[72vh] place-items-center px-4 text-center"><div><p class="eyebrow">404</p><h1 class="display-title mt-3 font-serif">This page checked out.</h1><p class="mt-4 text-muted">Let’s take you back to something delicious.</p><RouterLink class="primary-button mt-7" to="/">Return home</RouterLink></div></section>
</template>
