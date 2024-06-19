<template>
  <div class="theme-container">
    <VPNav></VPNav>
    <div class="main-container">
      <div class="left">
        <VPSidebar :open="false"></VPSidebar>
      </div>
      <div class="main">
        <VPDoc></VPDoc>
        <!-- <VPContent></VPContent> -->
      </div>
      <ClientOnly> <Preview ref="preview" class="show-absolute" /> </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPContent from '../components/VPContent.vue'
import Preview from '../components/Preview.vue'
import VPDoc from '../components/VPDoc.vue'
</script>

<style lang="stylus" scoped>
.theme-container
  display: flex
  height 100%

.main-container
  display flex
  min-height 100vh
  min-width 100%
  @media screen and (max-width: $MQMobile)
    flex-direction: column
    .preview-container
      display: none
  .main
    padding-top 64px
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
        position fixed
        top 64px
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
.left
  width 437px
  // @media (min-width: 1440px)
    // padding-left: max(32px, calc((100% - (var(--vp-layout-max-width) - 64px)) / 2));
    // width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
</style>
