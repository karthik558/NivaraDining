<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ExternalLink, Image, LayoutDashboard, LogOut, Menu, MessageSquareQuote,
  PackageOpen, ShieldCheck, Tags, Users, X,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const user = computed(() => {
  try { return JSON.parse(localStorage.getItem('currentAdminUser') || 'null') } catch { return null }
})

if (!user.value) router.replace('/sign-in')

const links = [
  { to: '/admin', label: 'Overview', description: 'Dining operations', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Menu catalogue', description: 'All 70 dishes', icon: PackageOpen },
  { to: '/admin/deal-products', label: 'Featured deals', description: 'Promoted selections', icon: Tags },
  { to: '/admin/slider-products', label: 'Landing slides', description: 'Homepage stories', icon: Image },
  { to: '/admin/testimonials', label: 'Guest reviews', description: 'Published feedback', icon: MessageSquareQuote },
  { to: '/admin/user-management', label: 'Team access', description: 'Admin permissions', icon: Users },
]

const logout = () => {
  localStorage.removeItem('currentAdminUser')
  router.push('/sign-in')
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f3f4] text-ink">
    <header class="sticky top-0 z-40 flex min-h-16 items-center border-b border-line bg-white/96 px-4 shadow-[0_8px_24px_rgba(33,29,32,.04)] backdrop-blur-xl sm:px-6">
      <button class="icon-button rounded-lg! lg:hidden" type="button" aria-label="Open admin navigation" @click="open = true"><Menu :size="19" /></button>
      <RouterLink to="/admin" class="ml-3 lg:ml-0" aria-label="Admin overview">
        <img class="h-10 w-22 object-contain object-left" src="/assets/img/logo/logo.png" alt="Lilac Hotels" />
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <RouterLink to="/" class="icon-button rounded-lg!" aria-label="View website" title="View website"><ExternalLink :size="17" /></RouterLink>
        <button class="icon-button rounded-lg!" type="button" aria-label="Sign out" @click="logout"><LogOut :size="17" /></button>
      </div>
    </header>

    <div class="flex">
      <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm lg:hidden" @click.self="open = false">
          <aside class="flex h-full w-[88%] max-w-82 flex-col bg-[#201a1f] p-4 text-white">
            <div class="flex items-center justify-between px-2 py-2"><img class="h-10 w-22 object-contain object-left" src="/assets/img/logo/logo-white.png" alt="Lilac Hotels" /><button class="grid size-10 place-items-center rounded-lg border border-white/15" @click="open = false"><X :size="18" /></button></div>
            <nav class="mt-5 grid gap-1.5">
              <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="admin-nav-link" :class="{ 'admin-nav-link--active': route.path === link.to }" @click="open = false">
                <component :is="link.icon" :size="18" /><span><strong>{{ link.label }}</strong><small>{{ link.description }}</small></span>
              </RouterLink>
            </nav>
            <div class="mt-auto flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"><ShieldCheck :size="19" /><span class="text-xs"><strong class="block">Secure session</strong><small class="text-white/45">Local administrator access</small></span></div>
          </aside>
        </div>
      </Transition>

      <aside class="sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 border-r border-white/5 bg-[#201a1f] p-4 text-white lg:flex lg:flex-col">
        <p class="px-3 pt-2 pb-3 text-[10px] font-bold tracking-[.18em] text-white/35 uppercase">Workspace</p>
        <nav class="grid gap-1.5">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="admin-nav-link" :class="{ 'admin-nav-link--active': route.path === link.to }">
            <component :is="link.icon" :size="18" /><span><strong>{{ link.label }}</strong><small>{{ link.description }}</small></span>
          </RouterLink>
        </nav>
        <div class="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
          <div class="flex items-center gap-2 text-sm font-semibold"><ShieldCheck :size="18" /> Service protected</div>
          <p class="mt-2 text-xs leading-5 text-white/40">Administrator changes are stored for this management workspace.</p>
        </div>
      </aside>

      <main class="min-w-0 flex-1"><RouterView /></main>
    </div>
  </div>
</template>
