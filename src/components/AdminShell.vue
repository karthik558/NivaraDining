<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BarChart3, Box, Image, LogOut, Menu, MessageSquareQuote, Tags, Users, X, ExternalLink } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const user = computed(() => {
  try { return JSON.parse(localStorage.getItem('currentAdminUser') || 'null') } catch { return null }
})
if (!user.value) router.replace('/sign-in')
const links = [
  { to: '/admin', label: 'Overview', icon: BarChart3 },
  { to: '/admin/products', label: 'Products', icon: Box },
  { to: '/admin/deal-products', label: 'Deal products', icon: Tags },
  { to: '/admin/slider-products', label: 'Homepage slides', icon: Image },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/user-management', label: 'Users', icon: Users },
]
const logout = () => {
  localStorage.removeItem('currentAdminUser')
  router.push('/sign-in')
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f5f6]">
    <header class="sticky top-0 z-40 flex min-h-18 items-center border-b border-line bg-white px-4 shadow-[0_5px_22px_rgba(41,26,38,.06)] sm:px-6">
      <button class="icon-button lg:hidden" @click="open = true" aria-label="Open admin navigation"><Menu :size="19" /></button>
      <img class="ml-3 h-12 w-24 object-contain lg:ml-0 lg:w-28" src="/assets/img/logo/logo.png" alt="Lilac Hotels" />
      <span class="ml-3 hidden border-l border-line pl-3 text-sm font-semibold sm:block">Dining administration</span>
      <div class="ml-auto flex items-center gap-2">
        <span class="mr-2 hidden text-right text-xs text-muted md:block">Signed in as<br /><strong class="text-ink">{{ user?.username }}</strong></span>
        <RouterLink to="/" class="secondary-button hidden min-h-10! px-4! sm:inline-flex"><ExternalLink :size="16" /> Main site</RouterLink>
        <button class="icon-button" aria-label="Sign out" @click="logout"><LogOut :size="17" /></button>
      </div>
    </header>
    <div class="flex">
      <div v-if="open" class="fixed inset-0 z-50 bg-ink/40 lg:hidden" @click.self="open = false">
        <aside class="h-full w-[82%] max-w-xs bg-[#201a1f] p-4 text-white">
          <div class="flex items-center justify-between px-2 py-3"><strong>Admin navigation</strong><button class="grid size-10 place-items-center rounded-full border border-white/15" @click="open=false"><X :size="18" /></button></div>
          <nav class="mt-5 grid gap-1">
            <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white" active-class="bg-white/12! text-white!" @click="open=false"><component :is="link.icon" :size="18" />{{ link.label }}</RouterLink>
          </nav>
        </aside>
      </div>
      <aside class="sticky top-18 hidden h-[calc(100vh-72px)] w-64 shrink-0 bg-[#201a1f] p-4 text-white lg:block">
        <nav class="grid gap-1">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/10 hover:text-white" :class="{ 'bg-white/12 text-white': route.path === link.to }"><component :is="link.icon" :size="18" />{{ link.label }}</RouterLink>
        </nav>
      </aside>
      <main class="min-w-0 flex-1"><RouterView /></main>
    </div>
  </div>
</template>
