<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ChevronDown, Clock3, ConciergeBell, Heart, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from '@lucide/vue'
import ProductCard from '../components/ProductCard.vue'
import { state } from '../store'

const route = useRoute()
const router = useRouter()
const page = computed(() => route.meta.page)
const sent = ref(false)
const faqOpen = ref(0)
const error = ref('')
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
    <section class="bg-warm py-12 md:py-16"><div class="page-shell"><p class="eyebrow">For later</p><h1 class="display-title mt-3">Saved items</h1></div></section>
    <section class="section-space"><div class="page-shell">
      <div v-if="state.wishlist.length" class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"><ProductCard v-for="product in state.wishlist" :key="product.id" :product="product" /></div>
      <div v-else class="surface grid min-h-96 place-items-center p-8 text-center"><div><span class="mx-auto grid size-16 place-items-center rounded-full bg-lilac-soft text-lilac"><Heart :size="28" /></span><h2 class="mt-5 text-2xl font-semibold">Nothing saved yet</h2><p class="mt-2 text-muted">Tap the heart on any dish to keep it here.</p><RouterLink class="primary-button mt-6" to="/product">Browse the menu</RouterLink></div></div>
    </div></section>
  </template>

  <template v-else-if="page === 'contact'">
    <section class="relative min-h-[650px] overflow-hidden bg-[#211a20] text-white lg:min-h-[720px]">
      <img class="absolute inset-0 h-full w-full object-cover object-center lg:object-right" src="/assets/img/product/ai/ai-product-23.jpg" alt="Lilac Hotels guest assistance" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#211a20] via-[#211a20]/90 to-[#211a20]/18"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(120,38,113,.7),transparent_38%)]"></div>
      <div class="page-shell relative flex min-h-[650px] items-center py-16 lg:min-h-[720px]">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">Guest assistance</p></div>
          <h1 class="mt-6 text-[clamp(3.7rem,8vw,7.2rem)] leading-[.9] font-semibold tracking-[-.07em]">We’re here<br />for your stay.</h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-white/65">Whether you need help choosing a dish, have a dietary request, or simply want to speak with someone, our team is close by.</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a class="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 font-semibold text-lilac hover:-translate-y-0.5" href="tel:08065551244"><Phone :size="17" /> Call guest assistance</a>
            <a class="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/20 px-6 font-semibold text-white hover:bg-white/10" href="mailto:reservations@lilachotels.com"><Mail :size="17" /> Send an email</a>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 -mt-8">
      <div class="page-shell grid gap-3 md:grid-cols-3">
        <a class="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card hover:-translate-y-1 hover:border-lilac/30" href="tel:08065551244">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><Phone :size="19" /></span><span><small class="text-muted">Call us directly</small><strong class="mt-0.5 block">080 6555 1244</strong></span>
        </a>
        <a class="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card hover:-translate-y-1 hover:border-lilac/30" href="https://wa.me/8129624036" target="_blank" rel="noreferrer">
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
            <div class="flex gap-4"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-lilac-soft text-lilac"><MapPin :size="18" /></span><div><strong>During your stay</strong><p class="mt-1 text-sm leading-6 text-muted">Room-side assistance coordinated with the Lilac team.</p></div></div>
          </div>
        </div>

        <form class="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-card sm:p-9" @submit.prevent="sent = true">
          <div class="absolute top-0 right-0 size-40 rounded-bl-full bg-lilac-soft"></div>
          <div class="relative">
            <p class="eyebrow">Send a note</p><h2 class="mt-2 text-3xl font-semibold tracking-[-.035em]">How can we help?</h2>
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
            { q: 'How do I check the status of my order?', a: 'Call 080 6555 1244 or open WhatsApp and share your room number with the team.' },
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
    <section class="grid min-h-[72vh] place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(120,38,113,.13),transparent_42%)] px-4 py-16">
      <form class="surface w-full max-w-md p-7 shadow-card sm:p-9" @submit.prevent="signIn">
        <span class="mx-auto grid size-14 place-items-center rounded-full bg-lilac text-white"><ShieldCheck :size="25" /></span><h1 class="mt-5 text-center text-3xl font-semibold">Admin portal</h1><p class="mt-2 text-center text-muted">Secure access to manage the dining experience.</p>
        <p v-if="error" class="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{{ error }}</p>
        <div class="mt-7 grid gap-5"><label class="grid gap-2 text-sm font-semibold">Username<input v-model="login.username" class="field" autocomplete="username" required /></label><label class="grid gap-2 text-sm font-semibold">Password<input v-model="login.password" class="field" type="password" autocomplete="current-password" required /></label></div>
        <button class="primary-button mt-7 w-full">Sign in <ArrowRight :size="17" /></button>
        <p class="mt-5 rounded-xl bg-lilac-soft p-3 text-center text-xs text-muted">Demo access: <strong>admin</strong> / <strong>admin</strong></p>
      </form>
    </section>
  </template>

  <section v-else class="grid min-h-[72vh] place-items-center px-4 text-center"><div><p class="eyebrow">404</p><h1 class="display-title mt-3">This page checked out.</h1><p class="mt-4 text-muted">Let’s take you back to something delicious.</p><RouterLink class="primary-button mt-7" to="/">Return home</RouterLink></div></section>
</template>
