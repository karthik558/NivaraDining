import { createRouter, createWebHistory } from 'vue-router'
import SiteShell from './components/SiteShell.vue'
import AdminShell from './components/AdminShell.vue'
import HomeView from './views/HomeView.vue'
import MenuView from './views/MenuView.vue'
import CartView from './views/CartView.vue'
import CheckoutView from './views/CheckoutView.vue'
import SimpleView from './views/SimpleView.vue'
import AdminView from './views/AdminView.vue'

const routes = [
  {
    path: '/',
    component: SiteShell,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'product', name: 'menu', component: MenuView },
      { path: 'cart', name: 'cart', component: CartView },
      { path: 'checkout', name: 'checkout', component: CheckoutView },
      { path: 'wishlist', name: 'wishlist', component: SimpleView, meta: { page: 'wishlist' } },
      { path: 'contact', name: 'contact', component: SimpleView, meta: { page: 'contact' } },
      { path: 'sign-in', name: 'sign-in', component: SimpleView, meta: { page: 'sign-in' } },
    ],
  },
  {
    path: '/admin',
    component: AdminShell,
    children: [
      { path: '', name: 'admin-dashboard', component: AdminView, meta: { section: 'dashboard' } },
      { path: 'products', component: AdminView, meta: { section: 'products' } },
      { path: 'deal-products', component: AdminView, meta: { section: 'deal products' } },
      { path: 'slider-products', component: AdminView, meta: { section: 'slider products' } },
      { path: 'testimonials', component: AdminView, meta: { section: 'testimonials' } },
      { path: 'user-management', component: AdminView, meta: { section: 'users' } },
    ],
  },
  { path: '/:pathMatch(.*)*', component: SimpleView, meta: { page: 'not-found' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, top: 120, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
