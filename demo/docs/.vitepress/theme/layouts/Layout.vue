<template>
  <div class="theme-container">
    <VPSkipLink />
    <VPNav> </VPNav>

    <div class="main-container">
      <VPSidebar></VPSidebar>
      <VPContent class="main"> </VPContent>
      <ClientOnly>
        <Preview ref="preview" class="show-absolute" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import VPContent from '../components/VPContent.vue'
import Preview from '../components/Preview.vue'

import { throttle } from 'lodash'

import { useData } from 'vitepress'
const { page, frontmatter, theme } = useData()
</script>

<style lang="stylus" scoped>
.theme-container
  display: flex
  height 100%

.main-container
  display flex
  min-height 100vh
  @media screen and (max-width: $MQMobile)
    flex-direction: column
    .preview-container
      display: none
  .main
    flex 1
    min-width: 600px
    background-color var(--bg-color)
    @media screen and (max-width: $MQMobileNarrow)
      min-width: unset
    ::v-deep .page-edit
      display none
  .preview-container
    flex-shrink 0
    background-color var(--bg-color)
    &.show-absolute
      ::v-deep .preview
        position absolute
        right 24px !important
        transform none !important
.right-panel
  padding-top: var(--vp-nav-height);
  min-width:200px
.page
  padding-bottom 0
  // padding-right 372px
  @media screen and (max-width 960px)
    padding-right 0
</style>
