import { computed, reactive, watch } from 'vue'
import products from '../data/products.json'
import extendedProducts from '../data/extended-products.json'

const legacyCategoryLabels = {
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

const normalizedProducts = [...products, ...extendedProducts].map((product) => ({
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
  products: normalizedProducts,
  cart: saved('lilac-cart'),
  wishlist: saved('lilac-wishlist'),
  search: '',
  cartOpen: false,
  toast: '',
  coupon: saved('lilac-coupon')[0] || null,
})

const persist = () => {
  localStorage.setItem('lilac-cart', JSON.stringify(state.cart))
  localStorage.setItem('lilac-wishlist', JSON.stringify(state.wishlist))
  localStorage.setItem('lilac-coupon', JSON.stringify(state.coupon ? [state.coupon] : []))
}

watch(() => [state.cart, state.wishlist, state.coupon], persist, { deep: true })

export const cartCount = computed(() => state.cart.reduce((sum, item) => sum + item.qty, 0))
export const cartSubtotal = computed(() => state.cart.reduce((sum, item) => sum + item.qty * item.price.max, 0))
export const cartDiscount = computed(() => {
  if (!state.coupon) return 0
  return Math.min(cartSubtotal.value * state.coupon.rate, state.coupon.maxDiscount)
})
export const taxableAmount = computed(() => Math.max(0, cartSubtotal.value - cartDiscount.value))
export const cartTax = computed(() => taxableAmount.value * 0.18)
export const cartTotal = computed(() => taxableAmount.value + cartTax.value)

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

export const applyCoupon = (code) => {
  const normalized = code.trim().toUpperCase()
  const coupons = {
    NIVARA10: { code: 'NIVARA10', rate: 0.1, maxDiscount: 500, label: '10% off' },
    VELORA10: { code: 'NIVARA10', rate: 0.1, maxDiscount: 500, label: '10% off' },
    AURA10: { code: 'NIVARA10', rate: 0.1, maxDiscount: 500, label: '10% off' },
    LILAC10: { code: 'NIVARA10', rate: 0.1, maxDiscount: 500, label: '10% off' },
    WELCOME15: { code: 'WELCOME15', rate: 0.15, maxDiscount: 750, label: '15% off' },
  }
  if (!coupons[normalized]) return { ok: false, message: 'That coupon is not valid. Try NIVARA10.' }
  state.coupon = coupons[normalized]
  notify(`${state.coupon.code} applied`)
  return { ok: true, message: `${state.coupon.label} applied to your order.` }
}

export const removeCoupon = () => {
  state.coupon = null
  notify('Coupon removed')
}
