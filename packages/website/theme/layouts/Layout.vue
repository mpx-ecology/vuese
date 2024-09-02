<template>
  <div class="theme-container" ref="themeContainerRef">
    <Layout>
      <template #main-content>
        <div class="main-container">
          <div class="main"><VPDoc></VPDoc></div>
          <ClientOnly>
            <Preview ref="preview" class="show-absolute" >
              <slot></slot>
            </Preview>
          </ClientOnly>
        </div>
      </template>
    </Layout>
  </div>
</template>

<script setup>
import Preview from '../components/Preview.vue'
import VPDoc from '../components/VPDoc.vue'
import Layout from '../components/Layout.vue'
</script>

<style lang="stylus" scoped>
.theme-container
  // display: flex
  height 100%
.main-container
  display flex
  min-height 100vh
  min-width 100%
  background-color #f7f8fa

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
      margin-top 64px
      @media (max-width 960px) {
        display none
      }
.page
  padding-bottom 0
  // padding-right 372px
  @media screen and (max-width 960px)
    padding-right 0
</style>
