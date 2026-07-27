<script setup>
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from '@lucide/vue'
import { cartSubtotal, removeFromCart, state, updateQuantity } from '../store'
</script>

<template>
  <section class="bg-warm py-12 md:py-16"><div class="page-shell"><p class="eyebrow">Review</p><h1 class="display-title mt-3">Your order</h1></div></section>
  <section class="section-space">
    <div class="page-shell">
      <div v-if="state.cart.length" class="grid gap-7 lg:grid-cols-[1fr_380px]">
        <div class="space-y-4">
          <article v-for="item in state.cart" :key="item.id" class="surface flex gap-4 p-3 sm:gap-6 sm:p-5">
            <img class="size-24 shrink-0 rounded-xl object-cover sm:size-32" :src="`/assets/img/product/${item.imgf}`" :alt="item.title" />
            <div class="flex min-w-0 flex-1 flex-col">
              <div class="flex justify-between gap-3">
                <div><h2 class="font-semibold sm:text-lg">{{ item.title }}</h2><p class="mt-1 font-bold text-lilac">₹{{ item.price.max }}</p></div>
                <button class="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-lilac-soft hover:text-lilac" :aria-label="`Remove ${item.title}`" @click="removeFromCart(item.id)"><Trash2 :size="17" /></button>
              </div>
              <div class="mt-auto flex items-center gap-3 pt-4">
                <button class="grid size-9 place-items-center rounded-full border border-line" @click="updateQuantity(item.id, item.qty - 1)"><Minus :size="15" /></button>
                <span class="w-5 text-center font-semibold">{{ item.qty }}</span>
                <button class="grid size-9 place-items-center rounded-full border border-line" @click="updateQuantity(item.id, item.qty + 1)"><Plus :size="15" /></button>
                <strong class="ml-auto">₹{{ (item.qty * item.price.max).toFixed(2) }}</strong>
              </div>
            </div>
          </article>
        </div>
        <aside class="surface h-fit p-6 lg:sticky lg:top-5">
          <h2 class="text-2xl font-semibold">Order summary</h2>
          <div class="mt-6 space-y-4 border-b border-line pb-5 text-sm">
            <div class="flex justify-between text-muted"><span>Subtotal</span><span class="text-ink">₹{{ cartSubtotal.toFixed(2) }}</span></div>
            <div class="flex justify-between text-muted"><span>Taxes</span><span class="text-ink">Calculated at checkout</span></div>
          </div>
          <div class="mt-5 flex justify-between text-lg font-semibold"><span>Total</span><span>₹{{ cartSubtotal.toFixed(2) }}</span></div>
          <RouterLink class="primary-button mt-6 w-full" to="/checkout">Continue to checkout <ArrowRight :size="17" /></RouterLink>
          <RouterLink class="mt-4 block text-center text-sm font-semibold text-lilac" to="/product">Continue browsing</RouterLink>
        </aside>
      </div>
      <div v-else class="surface grid min-h-96 place-items-center p-8 text-center">
        <div><span class="mx-auto grid size-16 place-items-center rounded-full bg-lilac-soft text-lilac"><ShoppingBag :size="28" /></span><h2 class="mt-5 text-2xl font-semibold">Your order is empty</h2><p class="mt-2 text-muted">Your next favourite dish is waiting.</p><RouterLink class="primary-button mt-6" to="/product">Explore the menu</RouterLink></div>
      </div>
    </div>
  </section>
</template>
