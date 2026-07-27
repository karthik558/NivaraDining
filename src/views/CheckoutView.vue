<script setup>
import { reactive, ref } from 'vue'
import {
  ArrowLeft, CheckCircle2, FileDown, MessageCircle,
  ReceiptText, ShieldCheck,
} from '@lucide/vue'
import {
  cartDiscount, cartSubtotal, cartTax, cartTotal, state,
} from '../store'

const submitted = ref(false)
const formRef = ref(null)
const orderNumber = `NIVARA-${Date.now().toString().slice(-8)}`
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  roomNumber: '',
  phoneNumber: '',
  specialRequest: '',
})

const generateInvoice = async () => {
  if (!state.cart.length) return
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const left = 18
  const right = pageWidth - 18
  let y = 20

  doc.setFillColor(120, 38, 113)
  doc.rect(0, 0, pageWidth, 42, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('NIVARA HOTELS', left, 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('In-room dining invoice', left, 28)
  doc.text(orderNumber, right, 19, { align: 'right' })
  doc.text(new Date().toLocaleString('en-IN'), right, 28, { align: 'right' })

  y = 55
  doc.setTextColor(33, 29, 32)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Guest details', left, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 8
  doc.text(`${form.firstName} ${form.lastName}`, left, y)
  doc.text(`Room: ${form.roomNumber}`, left, y + 6)
  doc.text(`Phone: ${form.phoneNumber}`, left, y + 12)
  doc.text(`Email: ${form.email}`, left, y + 18)

  y += 34
  doc.setFillColor(245, 238, 244)
  doc.roundedRect(left, y - 6, right - left, 10, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('Item', left + 3, y)
  doc.text('Qty', 126, y, { align: 'right' })
  doc.text('Rate', 155, y, { align: 'right' })
  doc.text('Amount', right - 3, y, { align: 'right' })
  y += 10

  doc.setFont('helvetica', 'normal')
  state.cart.forEach((item) => {
    if (y > 255) {
      doc.addPage()
      y = 20
    }
    const title = doc.splitTextToSize(item.title, 88)
    doc.text(title, left + 3, y)
    doc.text(String(item.qty), 126, y, { align: 'right' })
    doc.text(`Rs. ${item.price.max.toFixed(2)}`, 155, y, { align: 'right' })
    doc.text(`Rs. ${(item.qty * item.price.max).toFixed(2)}`, right - 3, y, { align: 'right' })
    y += Math.max(9, title.length * 5)
    doc.setDrawColor(233, 227, 231)
    doc.line(left, y - 4, right, y - 4)
  })

  if (y > 235) {
    doc.addPage()
    y = 20
  }
  y += 4
  const totalRows = [
    ['Subtotal', `Rs. ${cartSubtotal.value.toFixed(2)}`],
    ...(cartDiscount.value ? [['Coupon discount', `- Rs. ${cartDiscount.value.toFixed(2)}`]] : []),
    ['GST (18%)', `Rs. ${cartTax.value.toFixed(2)}`],
  ]
  totalRows.forEach(([label, value]) => {
    doc.text(label, 130, y)
    doc.text(value, right, y, { align: 'right' })
    y += 7
  })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Total', 130, y + 2)
  doc.text(`Rs. ${cartTotal.value.toFixed(2)}`, right, y + 2, { align: 'right' })

  if (form.specialRequest) {
    if (y > 255) {
      doc.addPage()
      y = 20
    }
    y += 17
    doc.setFontSize(10)
    doc.text('Special request', left, y)
    doc.setFont('helvetica', 'normal')
    doc.text(doc.splitTextToSize(form.specialRequest, right - left), left, y + 6)
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(113, 107, 112)
  doc.text('Thank you for dining with Nivara Hotels.', left, 286)
  doc.text('Dining assistance: +91 99999 99999', right, 286, { align: 'right' })
  doc.save(`${orderNumber}-invoice.pdf`)
}

const downloadInvoice = async () => {
  if (!formRef.value?.reportValidity()) return
  await generateInvoice()
}

const placeOrder = async () => {
  if (!state.cart.length) return
  await generateInvoice()
  const items = state.cart.map((item) => `${item.title} x ${item.qty} - Rs.${(item.qty * item.price.max).toFixed(2)}`).join('\n')
  const message = encodeURIComponent(
    `Nivara in-room dining order ${orderNumber}\n\nGuest: ${form.firstName} ${form.lastName}\nRoom: ${form.roomNumber}\nPhone: ${form.phoneNumber}\n\n${items}\n\nSubtotal: Rs.${cartSubtotal.value.toFixed(2)}\nCoupon: ${state.coupon?.code || 'None'}\nGST (18%): Rs.${cartTax.value.toFixed(2)}\nTotal: Rs.${cartTotal.value.toFixed(2)}\nSpecial request: ${form.specialRequest || 'None'}`,
  )
  submitted.value = true
  window.open(`https://wa.me/919999999999?text=${message}`, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="relative overflow-hidden bg-[#211a20] py-14 text-white lg:py-20">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(120,38,113,.75),transparent_40%)]"></div>
    <div class="page-shell relative">
      <div class="flex items-center gap-3"><span class="h-px w-9 bg-white/35"></span><p class="text-xs font-bold tracking-[.22em] text-white/60 uppercase">Final Checkout</p></div>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl font-serif">Guest Details &amp; Invoice</h1>
      <p class="mt-4 max-w-2xl text-lg text-white/65">Complete your room delivery details, download your itemised PDF receipt, and confirm your order.</p>
    </div>
  </section>

  <section class="section-space">
    <div class="page-shell">
      <div v-if="!state.cart.length" class="surface grid min-h-80 place-items-center p-8 text-center"><div><h2 class="text-2xl font-semibold">Your cart is empty</h2><RouterLink class="primary-button mt-6" to="/product">Explore the menu</RouterLink></div></div>

      <form v-else ref="formRef" class="grid items-start gap-7 lg:grid-cols-[1fr_420px]" @submit.prevent="placeOrder">
        <div class="surface overflow-hidden">
          <div class="border-b border-line bg-[#241d23] p-6 text-white sm:p-8">
            <div class="flex items-center gap-3"><span class="grid size-11 place-items-center rounded-full bg-white/10"><ShieldCheck :size="21" /></span><div><p class="text-xs font-bold tracking-[.14em] text-white/55 uppercase">Private guest information</p><h2 class="mt-1 text-2xl font-semibold">Where should we deliver?</h2></div></div>
          </div>
          <div class="p-5 sm:p-8">
            <div v-if="submitted" class="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800"><CheckCircle2 :size="21" /><span>Your invoice was downloaded and the order details opened in WhatsApp.</span></div>
            <p class="text-muted">Please use the details registered with your stay.</p>
            <div class="mt-7 grid gap-5 sm:grid-cols-2">
              <label class="grid gap-2 text-sm font-semibold">First name<input v-model="form.firstName" class="field" autocomplete="given-name" required /></label>
              <label class="grid gap-2 text-sm font-semibold">Last name<input v-model="form.lastName" class="field" autocomplete="family-name" required /></label>
              <label class="grid gap-2 text-sm font-semibold sm:col-span-2">Email address<input v-model="form.email" class="field" type="email" autocomplete="email" required /></label>
              <label class="grid gap-2 text-sm font-semibold">Room number<input v-model="form.roomNumber" class="field" inputmode="numeric" required /></label>
              <label class="grid gap-2 text-sm font-semibold">Phone number<input v-model="form.phoneNumber" class="field" type="tel" autocomplete="tel" required /></label>
              <label class="grid gap-2 text-sm font-semibold sm:col-span-2">Special request <span class="font-normal text-muted">(optional)</span><textarea v-model="form.specialRequest" class="field min-h-28 resize-y py-3" placeholder="Allergies, preferences, or delivery notes"></textarea></label>
            </div>
          </div>
        </div>

        <aside class="surface h-fit overflow-hidden lg:sticky lg:top-5">
          <div class="border-b border-line bg-lilac-soft p-6">
            <div class="flex items-center gap-3"><ReceiptText class="text-lilac" :size="24" /><div><p class="text-xs font-bold tracking-[.14em] text-lilac uppercase">Invoice {{ orderNumber }}</p><h2 class="mt-1 text-2xl font-semibold">Order summary</h2></div></div>
          </div>
          <div class="p-6">
            <div class="max-h-64 space-y-4 overflow-auto pr-1">
              <div v-for="item in state.cart" :key="item.id" class="flex items-center gap-3">
                <img class="size-12 rounded-lg object-cover" :src="`/assets/img/product/${item.imgf}`" :alt="item.title" />
                <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">{{ item.title }}</p><small class="text-muted">Qty {{ item.qty }}</small></div>
                <span class="text-sm font-semibold">₹{{ (item.qty * item.price.max).toFixed(2) }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3 border-y border-line py-5 text-sm">
              <div class="flex justify-between"><span class="text-muted">Subtotal</span><span>₹{{ cartSubtotal.toFixed(2) }}</span></div>
              <div v-if="cartDiscount" class="flex justify-between text-green-700"><span>Coupon ({{ state.coupon.code }})</span><span>−₹{{ cartDiscount.toFixed(2) }}</span></div>
              <div class="flex justify-between"><span class="text-muted">GST (18%)</span><span>₹{{ cartTax.toFixed(2) }}</span></div>
            </div>
            <div class="mt-5 flex justify-between text-lg font-semibold"><span>Total</span><span class="text-2xl text-lilac">₹{{ cartTotal.toFixed(2) }}</span></div>

            <button class="secondary-button mt-6 w-full" type="button" @click="downloadInvoice"><FileDown :size="18" /> Download PDF invoice</button>
            <button class="primary-button mt-3 w-full" type="submit"><MessageCircle :size="18" /> Generate & place order</button>
            <p class="mt-3 text-center text-xs leading-5 text-muted">Placing the order downloads the PDF invoice and opens a prepared WhatsApp order for confirmation.</p>
            <RouterLink class="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-lilac" to="/cart"><ArrowLeft :size="15" /> Back to cart</RouterLink>
          </div>
        </aside>
      </form>
    </div>
  </section>
</template>
