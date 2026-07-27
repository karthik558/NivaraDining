<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowUpRight, BadgeIndianRupee, Box, CheckCircle2, Clock3, FileText,
  Image, MessageSquareQuote, Pencil, Plus, Save, Search, Tags,
  Trash2, Users, X,
} from '@lucide/vue'
import products from '../../data/products.json'
import extendedProducts from '../../data/extended-products.json'
import dealData from '../../data/dealproduct.json'
import testimonials from '../../data/testimonials.json'

const route = useRoute()
const section = computed(() => route.meta.section)
const isMenuSection = computed(() => section.value === 'products' || section.value === 'deal products')
const search = ref('')
const modalOpen = ref(false)
const editing = ref(null)

const categoryLabels = {
  atfav: 'All Time Favorites',
  sandwich: 'Sandwiches',
  salads: 'Salads',
  burgers: 'Burgers',
  breads: 'Breads',
  deserts: 'Desserts',
  pizza: 'Pizza',
  straters: 'Starters',
  drinks: 'Drinks',
  Beverages: 'Drinks',
  'Indian Mains': 'Indian Entrées',
}

const allProducts = [...products, ...extendedProducts].map((product) => ({
  ...product,
  category: product.category?.map((item) => ({ ...item, type: categoryLabels[item.type] || item.type })) || [],
}))

const landingSlides = [
  { id: 1, title: 'Your room. Your table. Your moment.', subtitle: 'The art of staying in', image: '/assets/img/product/ai/ai-product-28.jpg', status: 'Published' },
  { id: 2, title: 'Local comfort, elevated.', subtitle: 'Rooted in flavour', image: '/assets/img/product/ai/ai-product-38.jpg', status: 'Published' },
  { id: 3, title: 'Leave room for delight.', subtitle: 'A beautiful finish', image: '/assets/img/product/ai/ai-product-45.jpg', status: 'Published' },
]

const adminUsers = [
  { id: 1, title: 'admin', subtitle: 'Super administrator', status: 'Active', image: '' },
]

const sectionConfig = computed(() => ({
  dashboard: { title: 'Dining overview', copy: 'A current view of Nivara’s in-room dining catalogue and guest experience.' },
  products: { title: 'Menu catalogue', copy: 'Manage all dishes, prices, categories, and menu availability.' },
  'deal products': { title: 'Featured deals', copy: 'Choose the dishes highlighted in promotional placements.' },
  'slider products': { title: 'Landing slides', copy: 'Manage the three stories displayed in the landing-page hero.' },
  testimonials: { title: 'Guest reviews', copy: 'Review and maintain published guest feedback.' },
  users: { title: 'Team access', copy: 'Manage administrator identities and workspace roles.' },
}[section.value] || { title: 'Admin workspace', copy: 'Manage the dining experience.' }))

const defaultRows = () => {
  if (section.value === 'products') return allProducts
  if (section.value === 'deal products') return [dealData.product]
  if (section.value === 'slider products') return landingSlides
  if (section.value === 'testimonials') return testimonials
  if (section.value === 'users') return adminUsers
  return []
}

const records = ref([])
const storageKey = computed(() => `lilac-admin-v2-${section.value}`)

watch(section, () => {
  search.value = ''
  try {
    records.value = JSON.parse(localStorage.getItem(storageKey.value) || 'null') || structuredClone(defaultRows())
  } catch {
    records.value = structuredClone(defaultRows())
  }
}, { immediate: true })

const persist = () => localStorage.setItem(storageKey.value, JSON.stringify(records.value))
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return records.value.filter((item) => !term || JSON.stringify(item).toLowerCase().includes(term))
})

const categories = computed(() => {
  const counts = {}
  allProducts.forEach((product) => product.category.forEach((item) => {
    counts[item.type] = (counts[item.type] || 0) + 1
  }))
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
})

const priceFloor = Math.min(...allProducts.map((product) => product.price.max))
const priceCeiling = Math.max(...allProducts.map((product) => product.price.max))
const averageScore = (allProducts.reduce((sum, product) => sum + product.rating, 0) / allProducts.length / 20).toFixed(1)

const stats = computed(() => [
  { label: 'Menu items', value: allProducts.length, detail: `${categories.value.length} categories`, icon: Box, to: '/admin/products' },
  { label: 'Featured deals', value: 1, detail: '1 expired promotion', icon: Tags, to: '/admin/deal-products' },
  { label: 'Landing slides', value: landingSlides.length, detail: 'All published', icon: Image, to: '/admin/slider-products' },
  { label: 'Guest reviews', value: testimonials.length, detail: `${averageScore}/5 menu score`, icon: MessageSquareQuote, to: '/admin/testimonials' },
])

const form = reactive({ title: '', subtitle: '', image: '', price: '', status: 'Active' })

const itemTitle = (item) => section.value === 'testimonials' ? (item.name || 'Unnamed guest') : (item.title || item.name || 'Untitled')
const itemImage = (item) => item.imgf ? `/assets/img/product/${item.imgf}` : (item.image || item.icon || '')
const itemStatus = (item) => {
  if (item.endTime && new Date(item.endTime) < new Date()) return 'Expired'
  return item.status || 'Active'
}
const itemDetails = (item) => {
  if (item.price) return `${item.category?.[0]?.type || 'Menu item'} · ₹${item.price.max}`
  if (item.offerPrice) return `${item.offerPrice} offer · ended ${new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.endTime))}`
  if (section.value === 'testimonials') return `${item.title || 'Nivara Hotels'} · ${item.text?.replace(/[“”]/g, '').slice(0, 90)}${item.text?.length > 90 ? '…' : ''}`
  return item.subtitle || item.subTitle || item.description || 'Managed content'
}

const openEditor = (item = null) => {
  editing.value = item
  form.title = item ? itemTitle(item) : ''
  form.subtitle = item?.text || item?.subtitle || item?.subTitle || item?.category?.[0]?.type || ''
  form.image = item ? itemImage(item) : ''
  form.price = item?.price?.max || ''
  form.status = itemStatus(item)
  modalOpen.value = true
}

const saveEditor = () => {
  if (editing.value) {
    const target = records.value.find((item) => item === editing.value)
    if (target) {
      if (section.value === 'testimonials') target.name = form.title
      else if ('name' in target && !('title' in target)) target.name = form.title
      else target.title = form.title
      if ('text' in target) target.text = form.subtitle
      else if ('subTitle' in target) target.subTitle = form.subtitle
      else target.subtitle = form.subtitle
      if (target.category?.length) target.category[0].type = form.subtitle
      if ('imgf' in target && form.image.includes('/assets/img/product/')) target.imgf = form.image.split('/assets/img/product/')[1]
      else if ('image' in target) target.image = form.image
      else if ('icon' in target) target.icon = form.image
      if (target.price) target.price.max = Number(form.price) || target.price.max
      target.status = form.status
    }
  } else {
    records.value.unshift({
      id: Date.now(),
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      status: form.status,
      ...(isMenuSection.value ? { price: { min: 0, max: Number(form.price) || 0 }, category: [{ type: form.subtitle || 'Uncategorised' }] } : {}),
    })
  }
  persist()
  modalOpen.value = false
}

const deleteRow = (item) => {
  if (!window.confirm(`Remove ${itemTitle(item)}?`)) return
  records.value = records.value.filter((entry) => entry !== item)
  persist()
}
</script>

<template>
  <div class="mx-auto max-w-370 p-4 sm:p-6 lg:p-8 xl:p-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex items-center gap-2 text-xs font-bold tracking-[.16em] text-lilac uppercase"><span class="size-2 rounded-full bg-lilac"></span>Nivara IRD</div>
        <h1 class="mt-3 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{{ sectionConfig.title }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">{{ sectionConfig.copy }}</p>
      </div>
      <button v-if="section !== 'dashboard'" class="primary-button shrink-0" @click="openEditor()"><Plus :size="17" /> Add {{ section === 'users' ? 'user' : 'item' }}</button>
    </div>

    <template v-if="section === 'dashboard'">
      <div class="mt-7 grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 xl:grid-cols-4">
        <RouterLink v-for="stat in stats" :key="stat.label" :to="stat.to" class="surface group p-5 hover:-translate-y-1 hover:border-lilac/30 hover:shadow-card sm:p-6">
          <div class="flex items-start justify-between">
            <span class="grid size-11 place-items-center rounded-lg bg-lilac-soft text-lilac"><component :is="stat.icon" :size="20" /></span>
            <ArrowUpRight class="text-muted group-hover:text-lilac" :size="18" />
          </div>
          <strong class="mt-7 block text-3xl tracking-[-.04em]">{{ stat.value }}</strong>
          <h2 class="mt-1 font-semibold">{{ stat.label }}</h2>
          <p class="mt-1 text-xs text-muted">{{ stat.detail }}</p>
        </RouterLink>
      </div>

      <div class="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section class="surface p-5 sm:p-6">
          <div class="flex items-center justify-between"><div><p class="eyebrow">Menu distribution</p><h2 class="mt-2 text-xl font-semibold">Category coverage</h2></div><span class="rounded-lg bg-canvas px-3 py-2 text-xs font-semibold text-muted">{{ categories.length }} total</span></div>
          <div class="mt-6 grid gap-4">
            <div v-for="category in categories.slice(0, 6)" :key="category.label">
              <div class="mb-2 flex justify-between text-sm"><span class="font-medium">{{ category.label }}</span><span class="text-muted">{{ category.count }} dishes</span></div>
              <div class="h-2 overflow-hidden rounded-full bg-line"><div class="h-full rounded-full bg-lilac" :style="{ width: `${(category.count / categories[0].count) * 100}%` }"></div></div>
            </div>
          </div>
          <RouterLink to="/admin/products" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lilac">Open menu catalogue <ArrowUpRight :size="16" /></RouterLink>
        </section>

        <section class="overflow-hidden rounded-lg bg-[#241d23] text-white">
          <div class="border-b border-white/10 p-5 sm:p-6">
            <div class="flex items-center justify-between"><div><p class="text-xs font-bold tracking-[.16em] text-white/45 uppercase">Service status</p><h2 class="mt-2 text-2xl font-semibold">Dining is available</h2></div><span class="flex items-center gap-2 rounded-lg bg-green-400/12 px-3 py-2 text-xs font-semibold text-green-300"><span class="size-2 rounded-full bg-green-300"></span>Live</span></div>
            <p class="mt-3 text-sm leading-6 text-white/55">Guest ordering is available daily from 7:30 AM until 10:30 PM.</p>
          </div>
          <div class="grid gap-px bg-white/8 min-[430px]:grid-cols-2">
            <div class="bg-[#241d23] p-5"><Clock3 class="text-white/45" :size="18" /><strong class="mt-4 block">15 service hours</strong><small class="mt-1 block text-white/40">Daily availability</small></div>
            <div class="bg-[#241d23] p-5"><BadgeIndianRupee class="text-white/45" :size="18" /><strong class="mt-4 block">₹{{ priceFloor }}–₹{{ priceCeiling }}</strong><small class="mt-1 block text-white/40">Current menu range</small></div>
            <div class="bg-[#241d23] p-5"><FileText class="text-white/45" :size="18" /><strong class="mt-4 block">PDF invoices</strong><small class="mt-1 block text-white/40">Generated at checkout</small></div>
            <div class="bg-[#241d23] p-5"><CheckCircle2 class="text-white/45" :size="18" /><strong class="mt-4 block">18% GST</strong><small class="mt-1 block text-white/40">Applied after discounts</small></div>
          </div>
        </section>
      </div>

      <section class="surface mt-5 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p class="eyebrow">Published experience</p><h2 class="mt-2 text-xl font-semibold">Content readiness</h2></div><span class="text-xs text-muted">Current website configuration</span></div>
        <div class="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          <div v-for="item in [
            { label: 'Catalogue', value: `${allProducts.length} dishes`, copy: 'Prices and categories available' },
            { label: 'Landing page', value: `${landingSlides.length} stories`, copy: 'Image-matched hero slides' },
            { label: 'Guest proof', value: `${testimonials.length} reviews`, copy: 'Published testimonial library' }
          ]" :key="item.label" class="p-5 sm:p-6"><p class="text-xs font-bold tracking-[.12em] text-muted uppercase">{{ item.label }}</p><strong class="mt-3 block text-xl">{{ item.value }}</strong><p class="mt-1 text-sm text-muted">{{ item.copy }}</p></div>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="surface mt-7 overflow-hidden">
        <div class="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div class="relative w-full max-w-md"><Search class="absolute top-1/2 left-4 -translate-y-1/2 text-muted" :size="17" /><input v-model="search" class="field pl-11" type="search" :placeholder="`Search ${sectionConfig.title.toLowerCase()}`" /></div>
          <span class="shrink-0 rounded-lg bg-canvas px-3 py-2 text-xs font-semibold text-muted">{{ filtered.length }} of {{ records.length }} records</span>
        </div>

        <div class="grid gap-3 p-3 md:hidden">
          <article v-for="(item, index) in filtered" :key="item.id || item.title || index" class="rounded-lg border border-line p-4">
            <div class="flex gap-3">
              <img v-if="itemImage(item)" class="size-14 rounded-lg bg-warm object-cover" :src="itemImage(item)" alt="" />
              <span v-else class="grid size-14 shrink-0 place-items-center rounded-lg bg-lilac-soft text-lilac"><Users :size="20" /></span>
              <div class="min-w-0 flex-1"><h2 class="truncate font-semibold">{{ itemTitle(item) }}</h2><p class="mt-1 line-clamp-2 text-sm text-muted">{{ itemDetails(item) }}</p></div>
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-line pt-3"><span class="rounded-lg px-2.5 py-1 text-xs font-semibold" :class="itemStatus(item) === 'Expired' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'">{{ itemStatus(item) }}</span><div class="flex gap-2"><button class="icon-button size-9! rounded-lg!" aria-label="Edit" @click="openEditor(item)"><Pencil :size="15" /></button><button class="icon-button size-9! rounded-lg! hover:border-red-500! hover:bg-red-500!" aria-label="Delete" @click="deleteRow(item)"><Trash2 :size="15" /></button></div></div>
          </article>
        </div>

        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-180 text-left">
            <thead class="bg-canvas text-xs tracking-[.08em] text-muted uppercase"><tr><th class="px-5 py-4">Item</th><th class="px-5 py-4">Details</th><th class="px-5 py-4">Status</th><th class="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody class="divide-y divide-line">
              <tr v-for="(item, index) in filtered" :key="item.id || item.title || index" class="hover:bg-canvas/70">
                <td class="px-5 py-4"><div class="flex items-center gap-3"><img v-if="itemImage(item)" class="size-12 rounded-lg bg-warm object-cover" :src="itemImage(item)" alt="" /><span v-else class="grid size-12 place-items-center rounded-lg bg-lilac-soft text-lilac"><Users :size="18" /></span><strong class="max-w-60 truncate">{{ itemTitle(item) }}</strong></div></td>
                <td class="max-w-90 px-5 py-4 text-sm text-muted">{{ itemDetails(item) }}</td>
                <td class="px-5 py-4"><span class="rounded-lg px-3 py-1 text-xs font-semibold" :class="itemStatus(item) === 'Expired' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'">{{ itemStatus(item) }}</span></td>
                <td class="px-5 py-4"><div class="flex justify-end gap-2"><button class="icon-button size-9! rounded-lg!" aria-label="Edit" @click="openEditor(item)"><Pencil :size="15" /></button><button class="icon-button size-9! rounded-lg! hover:border-red-500! hover:bg-red-500!" aria-label="Delete" @click="deleteRow(item)"><Trash2 :size="15" /></button></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!filtered.length" class="grid min-h-64 place-items-center p-8 text-center"><div><Search class="mx-auto text-muted" :size="28" /><h2 class="mt-4 text-xl font-semibold">No matching records</h2><p class="mt-2 text-sm text-muted">Try a different search term.</p></div></div>
      </section>
    </template>
  </div>

  <div v-if="modalOpen" class="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-5" @click.self="modalOpen = false">
    <form class="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-white p-5 shadow-2xl sm:rounded-lg sm:p-7" @submit.prevent="saveEditor">
      <div class="flex items-center justify-between"><div><p class="eyebrow">{{ editing ? 'Edit record' : 'Create record' }}</p><h2 class="mt-1 text-2xl font-semibold">{{ sectionConfig.title }}</h2></div><button type="button" class="icon-button rounded-lg!" @click="modalOpen = false"><X :size="18" /></button></div>
      <div class="mt-7 grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold sm:col-span-2">{{ section === 'testimonials' ? 'Guest name' : section === 'users' ? 'Username' : 'Title' }}<input v-model="form.title" class="field" required /></label>
        <label class="grid gap-2 text-sm font-semibold sm:col-span-2">{{ section === 'testimonials' ? 'Review text' : isMenuSection ? 'Category' : 'Supporting text' }}<textarea v-if="section === 'testimonials'" v-model="form.subtitle" class="field min-h-28 py-3"></textarea><input v-else v-model="form.subtitle" class="field" /></label>
        <label v-if="section !== 'users'" class="grid gap-2 text-sm font-semibold sm:col-span-2">Image path<input v-model="form.image" class="field" /></label>
        <label v-if="isMenuSection" class="grid gap-2 text-sm font-semibold">Price (₹)<input v-model="form.price" class="field" type="number" min="0" /></label>
        <label class="grid gap-2 text-sm font-semibold">Status<select v-model="form.status" class="field"><option>Active</option><option>Draft</option><option>Published</option></select></label>
      </div>
      <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="secondary-button" @click="modalOpen = false">Cancel</button><button class="primary-button"><Save :size="17" /> Save changes</button></div>
    </form>
  </div>
</template>
