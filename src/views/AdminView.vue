<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Box, Image, MessageSquareQuote, Plus, Search, Tags, Users, Pencil, Trash2, X, Save, TrendingUp } from '@lucide/vue'
import products from '../../data/products.json'
import sliderData from '../../data/sliderproduct.json'
import testimonials from '../../data/testimonials.json'

const route = useRoute()
const section = computed(() => route.meta.section)
const title = computed(() => section.value === 'dashboard' ? 'Dashboard overview' : section.value.replace(/\b\w/g, (c) => c.toUpperCase()))
const search = ref('')
const modalOpen = ref(false)
const editing = ref(null)
const defaultRows = () => {
  if (section.value === 'products') return products
  if (section.value === 'deal products') return products.slice(0, 5)
  if (section.value === 'slider products') return sliderData.slides
  if (section.value === 'testimonials') return testimonials
  if (section.value === 'users') return [{ id: 1, title: 'Administrator', subtitle: 'Super admin', image: '' }]
  return []
}
const records = ref([])
const storageKey = computed(() => `lilac-admin-${section.value}`)
watch(section, () => {
  search.value = ''
  try {
    records.value = JSON.parse(localStorage.getItem(storageKey.value) || 'null') || structuredClone(defaultRows())
  } catch {
    records.value = structuredClone(defaultRows())
  }
}, { immediate: true })
const persist = () => localStorage.setItem(storageKey.value, JSON.stringify(records.value))
const filtered = computed(() => records.value.filter((item) => JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase())))
const stats = [
  { label: 'Products', value: products.length, icon: Box, to: '/admin/products' },
  { label: 'Deals', value: 5, icon: Tags, to: '/admin/deal-products' },
  { label: 'Homepage slides', value: sliderData.slides.length, icon: Image, to: '/admin/slider-products' },
  { label: 'Testimonials', value: testimonials.length, icon: MessageSquareQuote, to: '/admin/testimonials' },
]
const form = reactive({ title: '', subtitle: '', image: '', price: '' })
const openEditor = (item = null) => {
  editing.value = item
  form.title = item?.title || item?.name || ''
  form.subtitle = item?.subTitle || item?.description || ''
  form.image = item?.image || item?.icon || ''
  form.price = item?.price?.max || ''
  modalOpen.value = true
}
const saveEditor = () => {
  if (editing.value) {
    const target = records.value.find((item) => item === editing.value)
    if (target) {
      if ('name' in target && !('title' in target)) target.name = form.title
      else target.title = form.title
      if ('subTitle' in target) target.subTitle = form.subtitle
      else target.subtitle = form.subtitle
      if ('image' in target) target.image = form.image
      if ('icon' in target) target.icon = form.image
      if (target.price) target.price.max = Number(form.price) || target.price.max
    }
  } else {
    records.value.unshift({
      id: Date.now(),
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      ...(section.value.includes('product') ? { price: { min: 0, max: Number(form.price) || 0 } } : {}),
    })
  }
  persist()
  modalOpen.value = false
}
const deleteRow = (item) => {
  if (!window.confirm(`Remove ${item.title || item.name}?`)) return
  records.value = records.value.filter((entry) => entry !== item)
  persist()
}
</script>

<template>
  <div class="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-9">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p class="eyebrow">Lilac IRD</p><h1 class="mt-2 text-3xl font-semibold tracking-[-.03em] md:text-4xl">{{ title }}</h1><p class="mt-2 text-sm text-muted">{{ section === 'dashboard' ? 'A clear view of the dining experience.' : `Manage ${section} from one focused workspace.` }}</p></div>
      <button v-if="section !== 'dashboard'" class="primary-button" @click="openEditor()"><Plus :size="17" /> Add new</button>
    </div>

    <template v-if="section === 'dashboard'">
      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink v-for="stat in stats" :key="stat.label" :to="stat.to" class="surface group p-6 hover:-translate-y-1 hover:border-lilac/30 hover:shadow-card">
          <div class="flex items-start justify-between"><span class="grid size-11 place-items-center rounded-full bg-lilac-soft text-lilac"><component :is="stat.icon" :size="20" /></span><strong class="text-3xl tracking-tight">{{ stat.value }}</strong></div>
          <h2 class="mt-8 font-semibold">{{ stat.label }}</h2><p class="mt-1 text-sm text-muted">View and manage</p>
        </RouterLink>
      </div>
      <div class="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section class="surface p-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold">Recent activity</h2><span class="rounded-full bg-lilac-soft px-3 py-1 text-xs font-semibold text-lilac">Today</span></div><div class="mt-6 divide-y divide-line">
          <div v-for="activity in ['Dining menu reviewed','Homepage offer updated','Guest testimonial approved']" :key="activity" class="flex items-center gap-4 py-4"><span class="grid size-10 place-items-center rounded-full bg-lilac-soft text-lilac"><TrendingUp :size="17" /></span><div><strong class="text-sm">{{ activity }}</strong><small class="mt-1 block text-muted">Completed by Administrator</small></div><time class="ml-auto text-xs text-muted">Today</time></div>
        </div></section>
        <section class="rounded-2xl bg-lilac p-7 text-white"><p class="text-xs font-bold tracking-[.16em] text-white/65 uppercase">Service status</p><h2 class="mt-3 text-3xl font-semibold">Dining is available</h2><p class="mt-3 leading-7 text-white/70">Guest ordering hours are set for 7:30 AM–10:30 PM daily.</p><RouterLink class="mt-7 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-lilac" to="/">View guest experience</RouterLink></section>
      </div>
    </template>

    <template v-else>
      <div class="surface mt-8 overflow-hidden">
        <div class="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div class="relative max-w-md flex-1"><Search class="absolute top-1/2 left-4 -translate-y-1/2 text-muted" :size="17" /><input v-model="search" class="field pl-11" type="search" :placeholder="`Search ${section}`" /></div>
          <span class="text-sm text-muted">{{ filtered.length }} record{{ filtered.length === 1 ? '' : 's' }}</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left">
            <thead class="bg-canvas text-xs tracking-[.08em] text-muted uppercase"><tr><th class="px-5 py-4">Item</th><th class="px-5 py-4">Details</th><th class="px-5 py-4">Status</th><th class="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody class="divide-y divide-line">
              <tr v-for="(item, index) in filtered" :key="item.id || item.title || index" class="hover:bg-canvas/70">
                <td class="px-5 py-4"><div class="flex items-center gap-3"><img v-if="item.imgf || item.image || item.icon" class="size-12 rounded-xl bg-warm object-cover" :src="item.imgf ? `/assets/img/product/${item.imgf}` : (item.image || item.icon)" alt="" /><span v-else class="grid size-12 place-items-center rounded-xl bg-lilac-soft text-lilac"><Users :size="18" /></span><strong class="max-w-60 truncate">{{ item.title || item.name }}</strong></div></td>
                <td class="max-w-80 px-5 py-4 text-sm text-muted">{{ item.description || item.subTitle || item.subtitle || (item.price ? `₹${item.price.max}` : 'Managed item') }}</td>
                <td class="px-5 py-4"><span class="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active</span></td>
                <td class="px-5 py-4"><div class="flex justify-end gap-2"><button class="icon-button size-9!" aria-label="Edit" @click="openEditor(item)"><Pencil :size="15" /></button><button class="icon-button size-9! hover:border-red-500! hover:bg-red-500!" aria-label="Delete" @click="deleteRow(item)"><Trash2 :size="15" /></button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>

  <div v-if="modalOpen" class="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-5" @click.self="modalOpen=false">
    <form class="w-full max-w-xl rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8" @submit.prevent="saveEditor">
      <div class="flex items-center justify-between"><div><p class="eyebrow">{{ editing ? 'Edit' : 'Create' }}</p><h2 class="mt-1 text-2xl font-semibold">{{ title.replace(/s$/, '') }}</h2></div><button type="button" class="icon-button" @click="modalOpen=false"><X :size="18" /></button></div>
      <div class="mt-7 grid gap-5 sm:grid-cols-2"><label class="grid gap-2 text-sm font-semibold sm:col-span-2">Title<input v-model="form.title" class="field" required /></label><label class="grid gap-2 text-sm font-semibold sm:col-span-2">Supporting text<input v-model="form.subtitle" class="field" /></label><label class="grid gap-2 text-sm font-semibold sm:col-span-2">Image path<input v-model="form.image" class="field" /></label><label v-if="section.includes('product')" class="grid gap-2 text-sm font-semibold">Price<input v-model="form.price" class="field" type="number" min="0" /></label></div>
      <div class="mt-7 flex justify-end gap-3"><button type="button" class="secondary-button" @click="modalOpen=false">Cancel</button><button class="primary-button"><Save :size="17" /> Save changes</button></div>
    </form>
  </div>
</template>
