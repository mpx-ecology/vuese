<script setup lang="ts">
import { useRoute } from 'vitepress'
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  provide,
  useSlots,
  watch
} from 'vue'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPFooter from 'vitepress/dist/client/theme-default/components/VPFooter.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import { useData } from 'vitepress/dist/client/theme-default/composables/data'
import {
  useCloseSidebarOnEscape,
  useSidebar
} from 'vitepress/dist/client/theme-default/composables/sidebar'
import throttle from 'lodash/throttle'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebar()

const route = useRoute()
watch(() => route.path, closeSidebar)

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

const { frontmatter } = useData()

const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])

provide('hero-image-slot-exists', heroImageSlotExists)

const sidebarRef = ref<any>(null)
const mainContentRef = ref<HTMLElement | null>(null)

const handleResize = throttle(() => {
  if (window.innerWidth >= 960) {
    mainContentRef.value.style.paddingLeft =
      sidebarRef.value.$el.offsetWidth + 'px'
  } else {
    mainContentRef.value.style.paddingLeft = '0'
  }
  mainContentRef.value.style.width=window.innerWidth-15+'px'
}, 300)
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    v-if="frontmatter.layout !== false"
    class="Layout"
    :class="frontmatter.pageClass"
  >
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
    <VPNav>
      <template #nav-bar-title-before
        ><slot name="nav-bar-title-before"
      /></template>
      <template #nav-bar-title-after
        ><slot name="nav-bar-title-after"
      /></template>
      <template #nav-bar-content-before
        ><slot name="nav-bar-content-before"
      /></template>
      <template #nav-bar-content-after
        ><slot name="nav-bar-content-after"
      /></template>
      <template #nav-screen-content-before
        ><slot name="nav-screen-content-before"
      /></template>
      <template #nav-screen-content-after
        ><slot name="nav-screen-content-after"
      /></template>
    </VPNav>
    <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <VPSidebar :open="isSidebarOpen" ref="sidebarRef">
      <template #sidebar-nav-before
        ><slot name="sidebar-nav-before"
      /></template>
      <template #sidebar-nav-after
        ><slot name="sidebar-nav-after"
      /></template>
    </VPSidebar>
    <div ref="mainContentRef"><slot name="main-content" /></div>
    <VPFooter />
    <slot name="layout-bottom" />
  </div>
  <Content v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
