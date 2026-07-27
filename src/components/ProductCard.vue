<script setup>
import { computed } from 'vue'
import { Heart, Plus, Star } from '@lucide/vue'
import { addToCart, addToWishlist, state } from '../store'

const props = defineProps({ product: { type: Object, required: true } })
const saved = computed(() => state.wishlist.some((item) => item.id === props.product.id))
</script>

<template>
  <article class="group flex h-full flex-col rounded-lg border border-line bg-white p-2.5 hover:-translate-y-1 hover:border-lilac/30 hover:shadow-card">
    <div class="relative aspect-[1/0.86] overflow-hidden rounded-md bg-warm">
      <img class="h-full w-full object-cover duration-500 group-hover:scale-[1.035]" :src="`/assets/img/product/${product.imgf}`" :alt="product.title" loading="lazy" />
      <button class="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/95 text-ink shadow-md hover:bg-lilac hover:text-white" :class="{ 'bg-lilac! text-white!': saved }" :aria-label="saved ? `Remove ${product.title} from saved items` : `Save ${product.title}`" @click="addToWishlist(product)">
        <Heart :size="17" :fill="saved ? 'currentColor' : 'none'" />
      </button>
    </div>
    <div class="flex flex-1 flex-col px-2 pt-4 pb-2">
      <h3 class="min-h-11 text-[15px] leading-snug font-semibold sm:text-base">{{ product.title }}</h3>
      <div class="mt-2 flex items-center gap-1 text-amber-500">
        <Star v-for="star in 5" :key="star" :size="12" :fill="star <= Math.round(product.rating / 20) ? 'currentColor' : 'none'" />
        <span class="ml-1 text-xs text-muted">{{ product.rating }}</span>
      </div>
      <div class="mt-auto flex items-center justify-between gap-3 pt-4">
        <p class="text-lg font-bold text-lilac">₹{{ product.price.max }}</p>
        <button class="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-lilac px-3.5 text-xs font-semibold text-white hover:bg-lilac-dark sm:px-4 sm:text-sm" @click="addToCart(product)">
          <Plus :size="16" /> <span class="hidden min-[400px]:inline">Add</span>
        </button>
      </div>
    </div>
  </article>
</template>
