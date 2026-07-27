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
      { path: '', name: 'home', component: HomeView, meta: { title: 'Nivara Hotels & Stays | Luxury Hospitality & Fine In-Room Dining' } },
      { path: 'product', name: 'menu', component: MenuView, meta: { title: 'Curated In-Room Dining Menu | Nivara Hotels & Stays' } },
      { path: 'cart', name: 'cart', component: CartView, meta: { title: 'Your Order Cart | Nivara In-Room Dining' } },
      { path: 'checkout', name: 'checkout', component: CheckoutView, meta: { title: 'Guest Checkout & Room Delivery | Nivara Hotels' } },
      { path: 'wishlist', name: 'wishlist', component: SimpleView, meta: { page: 'wishlist', title: 'Saved Culinary Favorites | Nivara Hotels' } },
      { path: 'contact', name: 'contact', component: SimpleView, meta: { page: 'contact', title: 'Guest Assistance & Concierge | Nivara Hotels & Stays' } },
      { path: 'sign-in', name: 'sign-in', component: SimpleView, meta: { page: 'sign-in', title: 'Guest Portal Access | Nivara Hospitality' } },
      { path: 'privacy-policy', name: 'privacy-policy', component: SimpleView, meta: { page: 'privacy-policy', title: 'Privacy Policy | Nivara Hotels & Stays' } },
      { path: 'cookies-policy', name: 'cookies-policy', component: SimpleView, meta: { page: 'cookies-policy', title: 'Cookies & Local Storage Policy | Nivara Hotels' } },
      { path: 'refund-policy', name: 'refund-policy', component: SimpleView, meta: { page: 'refund-policy', title: 'Refund & Cancellation Policy | Nivara In-Room Dining' } },
      { path: 'terms', name: 'terms', component: SimpleView, meta: { page: 'terms', title: 'Terms & Conditions of Service | Nivara Hotels' } },
    ],
  },
  {
    path: '/admin',
    component: AdminShell,
    children: [
      { path: '', name: 'admin-dashboard', component: AdminView, meta: { section: 'dashboard', title: 'Dining Operations Dashboard | Nivara Admin Panel' } },
      { path: 'products', component: AdminView, meta: { section: 'products', title: 'Menu Catalogue Management | Nivara Admin Panel' } },
      { path: 'deal-products', component: AdminView, meta: { section: 'deal products', title: 'Promotional Offers & Deals | Nivara Admin Panel' } },
      { path: 'slider-products', component: AdminView, meta: { section: 'slider products', title: 'Hero Story Management | Nivara Admin Panel' } },
      { path: 'testimonials', component: AdminView, meta: { section: 'testimonials', title: 'Guest Reviews & Feedback | Nivara Admin Panel' } },
      { path: 'user-management', component: AdminView, meta: { section: 'users', title: 'User Management & Roles | Nivara Admin Panel' } },
    ],
  },
  { path: '/:pathMatch(.*)*', component: SimpleView, meta: { page: 'not-found', title: 'Page Not Found | Nivara Hotels & Stays' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, top: 120, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
