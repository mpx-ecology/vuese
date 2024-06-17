<template>
  <div
    class="theme-container"
  >
    <Navbar ref="navbar" />
    <!-- <div class="sidebar-mask" @click="toggleSidebar(false)" />
    <Sidebar ref="sidebar" :items="sidebarItems" @toggle-sidebar="toggleSidebar" />
    <div class="main-container" :style="style">
      <Home class="main" v-if="$page.frontmatter.home" />
      <Page class="main" v-else :sidebar-items="sidebarItems" />
      <ClientOnly>
        <Preview ref="preview" class="show-absolute" />
      </ClientOnly>
    </div> -->
  </div>
</template>

<script>
// import DefaultTheme from 'vitepress/theme'
// import Home from '@parent-theme/components/Home.vue'
import Navbar from 'vitepress/dist/client/theme-default/components/VPNavBar.vue'
// import Page from '@parent-theme/components/Page.vue'
// import Sidebar from '@parent-theme/components/Sidebar.vue'
// import { resolveSidebarItems } from '@parent-theme/util'
// import Preview from '@theme/components/Preview.vue'
import { throttle } from 'lodash'

export default {
  name: 'Layout',
  components: {
    Navbar
  }
}
</script>

<style lang="stylus" scoped>
.theme-container
  height 100%

.main-container
  display flex
  min-height 100vh
  width 100vw
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

.page
  padding-bottom 0
  // padding-right 372px
  @media screen and (max-width 960px)
    padding-right 0

</style>
