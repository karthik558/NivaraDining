<script setup>
import { ref } from 'vue'
import {
  ArrowRight, BadgePercent, CheckCircle2, Minus, Plus,
  ShoppingBag, Trash2, X,
} from '@lucide/vue'
import {
  applyCoupon, cartDiscount, cartSubtotal, cartTax, cartTotal,
  removeCoupon, removeFromCart, state, updateQuantity,
} from '../store'

const couponCode = ref(state.coupon?.code || '')
const couponMessage = ref('')
const couponError = ref(false)

const submitCoupon = () => {
  const result = applyCoupon(couponCode.value)
  couponMessage.value = result.message
  couponError.value = !result.ok
}

const clearCoupon = () => {
  removeCoupon()
  couponCode.value = ''
  couponMessage.value = ''
  couponError.value = false
}
</script>

<template>
  <section class="relative overflow-hidden bg-warm py-12 md:py-16">
    <div class="absolute -top-30 right-0 size-80 rounded-full bg-lilac/6 blur-3xl"></div>
    <div class="page-shell relative"><p class="eyebrow">Review your selection</p><h1 class="display-title mt-3">Your cart</h1><p class="mt-4 max-w-xl text-muted">Adjust quantities, apply a dining offer, and review the complete total before checkout.</p></div>
  </section>

  <section class="section-space">
    <div class="page-shell">
      <div v-if="state.cart.length" class="grid items-start gap-7 lg:grid-cols-[1fr_400px]">
        <div class="space-y-4">
          <article v-for="item in state.cart" :key="item.id" class="surface group grid gap-4 p-3 sm:grid-cols-[128px_1fr] sm:gap-6 sm:p-5">
            <img class="aspect-[1.25/1] w-full rounded-xl object-cover sm:aspect-square sm:size-32" :src="`/assets/img/product/${item.imgf}`" :alt="item.title" />
            <div class="flex min-w-0 flex-col">
              <div class="flex justify-between gap-3">
                <div>
                  <p class="text-xs font-bold tracking-[.14em] text-lilac uppercase">Nivara kitchen</p>
                  <h2 class="mt-1 font-semibold sm:text-lg">{{ item.title }}</h2>
                  <p class="mt-1 text-sm text-muted">₹{{ item.price.max.toFixed(2) }} per item</p>
                </div>
                <button class="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-sm font-semibold text-red-700 hover:border-red-500 hover:bg-red-500 hover:text-white" :aria-label="`Remove ${item.title}`" @click="removeFromCart(item.id)">
                  <Trash2 :size="16" /><span class="hidden sm:inline">Remove</span>
                </button>
              </div>

              <div class="mt-5 flex flex-wrap items-center gap-3 sm:mt-auto">
                <div class="inline-flex items-center rounded-full border border-line bg-canvas p-1">
                  <button class="grid size-9 place-items-center rounded-full bg-white hover:bg-lilac hover:text-white" :aria-label="`Decrease ${item.title} quantity`" @click="updateQuantity(item.id, item.qty - 1)"><Minus :size="15" /></button>
                  <span class="w-10 text-center font-semibold">{{ item.qty }}</span>
                  <button class="grid size-9 place-items-center rounded-full bg-white hover:bg-lilac hover:text-white" :aria-label="`Increase ${item.title} quantity`" @click="updateQuantity(item.id, item.qty + 1)"><Plus :size="15" /></button>
                </div>
                <span class="text-sm text-muted">Item total</span>
                <strong class="ml-auto text-lg text-lilac">₹{{ (item.qty * item.price.max).toFixed(2) }}</strong>
              </div>
            </div>
          </article>

          <div class="rounded-2xl border border-dashed border-lilac/30 bg-lilac-soft/45 p-5">
            <div class="flex items-center gap-3"><span class="grid size-10 place-items-center rounded-full bg-white text-lilac"><BadgePercent :size="19" /></span><div><h2 class="font-semibold">Have a coupon?</h2><p class="text-sm text-muted">Enter your dining code before checkout.</p></div></div>
            <div v-if="state.coupon" class="mt-5 flex items-center gap-3 rounded-xl bg-white p-3">
              <CheckCircle2 class="text-green-600" :size="20" />
              <span class="flex-1 text-sm"><strong>{{ state.coupon.code }}</strong> · {{ state.coupon.label }}</span>
              <button class="grid size-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700" aria-label="Remove coupon" @click="clearCoupon"><X :size="16" /></button>
            </div>
            <form v-else class="mt-5 flex flex-col gap-3 sm:flex-row" @submit.prevent="submitCoupon">
              <input v-model="couponCode" class="field bg-white!" placeholder="Coupon code" aria-label="Coupon code" />
              <button class="secondary-button shrink-0 bg-white!" type="submit">Apply coupon</button>
            </form>
            <p v-if="couponMessage" class="mt-3 text-sm font-medium" :class="couponError ? 'text-red-700' : 'text-green-700'">{{ couponMessage }}</p>
            <p v-else-if="!state.coupon" class="mt-3 text-xs text-muted">Try <strong>NIVARA10</strong> for 10% off, up to ₹500.</p>
          </div>
        </div>

        <aside class="surface h-fit overflow-hidden lg:sticky lg:top-5">
          <div class="border-b border-line bg-[#241d23] p-6 text-white">
            <p class="text-xs font-bold tracking-[.16em] text-white/55 uppercase">Complete total</p>
            <h2 class="mt-2 text-2xl font-semibold">Order summary</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4 border-b border-line pb-5 text-sm">
              <div class="flex justify-between text-muted"><span>Subtotal</span><span class="font-medium text-ink">₹{{ cartSubtotal.toFixed(2) }}</span></div>
              <div v-if="cartDiscount" class="flex justify-between text-green-700"><span>Coupon discount</span><span>−₹{{ cartDiscount.toFixed(2) }}</span></div>
              <div class="flex justify-between text-muted"><span>GST (18%)</span><span class="font-medium text-ink">₹{{ cartTax.toFixed(2) }}</span></div>
            </div>
            <div class="mt-5 flex items-end justify-between"><span class="font-semibold">Total payable</span><span class="text-2xl font-bold text-lilac">₹{{ cartTotal.toFixed(2) }}</span></div>
            <p class="mt-2 text-xs text-muted">Tax is calculated after any coupon discount.</p>
            <RouterLink class="primary-button mt-6 w-full" to="/checkout">Continue to checkout <ArrowRight :size="17" /></RouterLink>
            <RouterLink class="secondary-button mt-3 w-full" to="/product">Continue browsing</RouterLink>
          </div>
        </aside>
      </div>

      <div v-else class="surface grid min-h-96 place-items-center p-8 text-center">
        <div><span class="mx-auto grid size-16 place-items-center rounded-lg bg-lilac-soft text-lilac"><ShoppingBag :size="28" /></span><h2 class="mt-5 text-2xl font-semibold">Your cart is empty</h2><p class="mt-2 text-muted">Your next favourite dish is waiting.</p><RouterLink class="primary-button mt-6" to="/product">Explore the menu</RouterLink></div>
      </div>
    </div>
  </section>
</template>
