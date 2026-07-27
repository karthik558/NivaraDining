<script setup>
import { onMounted, ref } from 'vue'
import { Soup } from '@lucide/vue'

const loading = ref(true)

onMounted(() => {
  window.setTimeout(() => {
    loading.value = false
  }, 700)
})
</script>

<template>
  <Transition name="preloader">
    <div v-if="loading" class="site-preloader" role="status" aria-live="polite">
      <div class="site-preloader__mark">
        <span class="site-preloader__steam site-preloader__steam--one"></span>
        <span class="site-preloader__steam site-preloader__steam--two"></span>
        <span class="site-preloader__steam site-preloader__steam--three"></span>
        <Soup :size="44" :stroke-width="1.6" />
      </div>
      <p class="mt-5 text-xs font-bold tracking-[.2em] uppercase">Preparing your table</p>
      <span class="site-preloader__line"><i></i></span>
    </div>
  </Transition>

  <RouterView />
</template>
