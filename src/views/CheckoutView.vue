<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft, CheckCircle2, MessageCircle } from '@lucide/vue'
import { cartSubtotal, state } from '../store'

const submitted = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', roomNumber: '', phoneNumber: '', specialRequest: '' })
const gst = computed(() => cartSubtotal.value * 0.18)
const total = computed(() => cartSubtotal.value + gst.value)
const placeOrder = () => {
  if (!state.cart.length) return
  const items = state.cart.map((item) => `${item.title} × ${item.qty} — ₹${(item.qty * item.price.max).toFixed(2)}`).join('\n')
  const message = encodeURIComponent(`Lilac in-room dining order\n\nGuest: ${form.firstName} ${form.lastName}\nRoom: ${form.roomNumber}\nPhone: ${form.phoneNumber}\n\n${items}\n\nTotal including GST: ₹${total.value.toFixed(2)}\nSpecial request: ${form.specialRequest || 'None'}`)
  submitted.value = true
  window.open(`https://wa.me/8129624036?text=${message}`, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="bg-warm py-12 md:py-16"><div class="page-shell"><p class="eyebrow">Final step</p><h1 class="display-title mt-3">Guest details</h1></div></section>
  <section class="section-space">
    <div class="page-shell">
      <div v-if="!state.cart.length" class="surface grid min-h-80 place-items-center p-8 text-center"><div><h2 class="text-2xl font-semibold">Your order is empty</h2><RouterLink class="primary-button mt-6" to="/product">Explore the menu</RouterLink></div></div>
      <form v-else class="grid gap-7 lg:grid-cols-[1fr_400px]" @submit.prevent="placeOrder">
        <div class="surface p-5 sm:p-8">
          <div v-if="submitted" class="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800"><CheckCircle2 :size="21" /><span>Order details opened in WhatsApp.</span></div>
          <h2 class="text-2xl font-semibold">Where should we deliver?</h2>
          <p class="mt-2 text-muted">Please share the details registered with your stay.</p>
          <div class="mt-7 grid gap-5 sm:grid-cols-2">
            <label class="grid gap-2 text-sm font-semibold">First name<input v-model="form.firstName" class="field" autocomplete="given-name" required /></label>
            <label class="grid gap-2 text-sm font-semibold">Last name<input v-model="form.lastName" class="field" autocomplete="family-name" required /></label>
            <label class="grid gap-2 text-sm font-semibold sm:col-span-2">Email address<input v-model="form.email" class="field" type="email" autocomplete="email" required /></label>
            <label class="grid gap-2 text-sm font-semibold">Room number<input v-model="form.roomNumber" class="field" inputmode="numeric" required /></label>
            <label class="grid gap-2 text-sm font-semibold">Phone number<input v-model="form.phoneNumber" class="field" type="tel" autocomplete="tel" required /></label>
            <label class="grid gap-2 text-sm font-semibold sm:col-span-2">Special request <span class="font-normal text-muted">(optional)</span><textarea v-model="form.specialRequest" class="field min-h-28 resize-y py-3" placeholder="Allergies, preferences, or delivery notes"></textarea></label>
          </div>
        </div>
        <aside class="surface h-fit p-6 lg:sticky lg:top-5">
          <h2 class="text-2xl font-semibold">Order summary</h2>
          <div class="mt-6 max-h-64 space-y-4 overflow-auto">
            <div v-for="item in state.cart" :key="item.id" class="flex items-center gap-3">
              <img class="size-12 rounded-lg object-cover" :src="`/assets/img/product/${item.imgf}`" :alt="item.title" />
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">{{ item.title }}</p><small class="text-muted">Qty {{ item.qty }}</small></div>
              <span class="text-sm font-semibold">₹{{ (item.qty * item.price.max).toFixed(2) }}</span>
            </div>
          </div>
          <div class="mt-6 space-y-3 border-y border-line py-5 text-sm">
            <div class="flex justify-between"><span class="text-muted">Subtotal</span><span>₹{{ cartSubtotal.toFixed(2) }}</span></div>
            <div class="flex justify-between"><span class="text-muted">GST (18%)</span><span>₹{{ gst.toFixed(2) }}</span></div>
          </div>
          <div class="mt-5 flex justify-between text-lg font-semibold"><span>Total</span><span>₹{{ total.toFixed(2) }}</span></div>
          <button class="primary-button mt-6 w-full" type="submit"><MessageCircle :size="18" /> Place order via WhatsApp</button>
          <RouterLink class="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-lilac" to="/cart"><ArrowLeft :size="15" /> Back to order</RouterLink>
        </aside>
      </form>
    </div>
  </section>
</template>
