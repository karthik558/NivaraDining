import { computed, reactive, watch } from 'vue'
import products from '../data/products.json'
import extendedProducts from '../data/extended-products.json'

const legacyCategoryLabels = {
  atfav: 'Guest Favourites',
  sandwich: 'Sandwiches',
  salads: 'Salads',
  burgers: 'Burgers',
  breads: 'Breads',
  deserts: 'Desserts',
  pizza: 'Pizza',
  straters: 'Starters',
}

const normalizedProducts = products.map((product) => ({
  ...product,
  category: product.category?.map((category) => ({
    ...category,
    type: legacyCategoryLabels[category.type] || category.type,
  })),
}))

const saved = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export const state = reactive({
  products: [...normalizedProducts, ...extendedProducts],
  cart: saved('lilac-cart'),
  wishlist: saved('lilac-wishlist'),
  search: '',
  cartOpen: false,
  toast: '',
})

const persist = () => {
  localStorage.setItem('lilac-cart', JSON.stringify(state.cart))
  localStorage.setItem('lilac-wishlist', JSON.stringify(state.wishlist))
}

watch(() => [state.cart, state.wishlist], persist, { deep: true })

export const cartCount = computed(() => state.cart.reduce((sum, item) => sum + item.qty, 0))
export const cartSubtotal = computed(() => state.cart.reduce((sum, item) => sum + item.qty * item.price.max, 0))

const notify = (message) => {
  state.toast = message
  window.setTimeout(() => {
    if (state.toast === message) state.toast = ''
  }, 2200)
}

export const addToCart = (product) => {
  const existing = state.cart.find((item) => item.id === product.id)
  if (existing) existing.qty += 1
  else state.cart.push({ ...product, qty: 1 })
  notify(`${product.title} added to your order`)
}

export const addToWishlist = (product) => {
  const index = state.wishlist.findIndex((item) => item.id === product.id)
  if (index >= 0) {
    state.wishlist.splice(index, 1)
    notify(`${product.title} removed from saved items`)
  } else {
    state.wishlist.push(product)
    notify(`${product.title} saved`)
  }
}

export const removeFromCart = (id) => {
  const index = state.cart.findIndex((item) => item.id === id)
  if (index >= 0) state.cart.splice(index, 1)
}

export const updateQuantity = (id, qty) => {
  const item = state.cart.find((entry) => entry.id === id)
  if (item) item.qty = Math.max(1, qty)
}
