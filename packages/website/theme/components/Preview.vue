<template>
  <div class="preview-container" v-if="showPreview">
    <div class="preview" ref="previewRef">
      <header class="header">
        <i
          class="cubeic cubeic-back"
          v-show="isShowBack"
          @click="back"
        />
        {{ title }}
      </header>
      <div class="simulator-wrapper">
        <iframe
          ref="iframeRef"
          class="simulator"
          :src="previewPath"
          frameborder="0"
          width="100%"
          height="100%"
        />
      </div>
      <div class="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash-es'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute, useData } from 'vitepress'
import { syncPathToParent } from '@mpxjs/vuese-website/dist/iframe-sync'

const COMPONENT_DIR_NAME = 'components'

const route = useRoute()
const router = useRouter()
const back = () => {
  window.history.back()
}

const { site, theme } = useData()
const iframeConfig = computed(() => theme.value.iframeConfig)
const showPreview = computed(() => {
  return !iframeConfig.value.hide
})
const previewPath = (() => {
  const baseUrl = process.env.NODE_ENV === 'development'
    ? iframeConfig.value?.path.dev
    : iframeConfig.value?.path.prod
  return baseUrl
})();

const getComponentName = () => {
  const name = route.path.split('/').pop()?.replace('.html', '')
  if (!name) return ''
  return name
}

const title = computed(() => {
  
  return getComponentName()
})

const iframeRef = ref()
const syncChildPath = to => {
  syncPathToParent(iframeRef.value, getComponentName())
}

const isShowBack = ref(false)
const showBackHandler = (newPath: string) => {
  if (iframeConfig.value.showBackHandler) {
    isShowBack.value = iframeConfig.value.showBackHandler(newPath)
  } else {
    isShowBack.value = !newPath.includes('/guide/intro')
  }
}

watch(() => route.path, (newPath, oldPath) => {
  syncChildPath(newPath)
  showBackHandler(newPath)
})

const handleMessage = e => {
  if (e.data?.value !== undefined) {
    const data = e.data
    if (data.value) {
      router.go(`${site.value.base}${COMPONENT_DIR_NAME}/${data.value}.html`)
      return
    }
    const findComponent = list => {
      if (!Array.isArray(list)) {
        return null
      }
      for (const item of list) {
        if (item.path?.endsWith(data.value)) {
          return item
        }
        const target = findComponent(item.children)
        if (target) {
          return target
        }
      }
      return null
    }
    const component = findComponent([
      theme.value.sidebar.find(item => item.title === '组件')
    ])
    if (component) {
      router.go(`${site.value.base}${COMPONENT_DIR_NAME}/${component.path}.html`)
    }
  }
}

const previewRef = ref()
const calcPreviewerHeight = () => {
  const el = previewRef.value
  el.style.height = `${window.innerHeight - 110}px`
}

const handleResize = throttle(() => {
  calcPreviewerHeight()
}, 10)

window.addEventListener('message', handleMessage)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize as EventListenerOrEventListenerObject)
  iframeRef.value.onload = () => {
    syncChildPath(router.route.path)
    showBackHandler(router.route.path)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize as EventListenerOrEventListenerObject)
  window.removeEventListener('message', handleMessage)
})
</script>

<style lang="stylus" scoped>
.preview-container
  position relative
  width 385px
  min-width 385px
  padding-right 24px
  box-sizing border-box
  overflow hidden
  .preview
    margin-top: 2rem
    position fixed
    top 84px
    width 360px
    min-width 360px
    min-height 560px
    max-height 667px
    background-color #fff
    border-radius 20px 20px 100px 100px
    background url(https://dpubstatic.udache.com/static/dpubimg/mTIQh7C_y7ah3bMFu0guA_iphoneX.png) no-repeat center 0
    background-size 100%
    padding 25px
    padding-top 54px
    box-sizing border-box
    .header
      position relative
      z-index 1
      line-height 32px
      height 32px
      padding-bottom 6px
      font-weight 700
      text-align center
      background-color #edf0f4
      .cubeic-back
        position absolute
        top calc(50% - 3px)
        left 0
        transform translateY(-50%)
        width 0
        height 0
        padding 0 6px
        border 8px solid rgba(0, 0, 0, 0)
        border-right 8px solid #fc9153
        cursor pointer
        &:after
          content: ''
          position: absolute
          top -4px
          right -13px
          width 8px
          height 8px
          background #edf0f4
          transform rotate(45deg)
    .simulator-wrapper
      position absolute
      left 25px
      top 90px
      right 25px
      bottom 18px
      z-index 10
      overflow hidden
      border-radius 0 0 53px 53px
      .simulator
        background-color var(--bg-color)
    .footer
      position absolute
      left 7px
      bottom 0
      width calc(100% - 24.5px)
      height 200px
      border 4.5px solid #d9dce2
      border-top none
      border-radius 0 0 60px 60px
      background #fff
      overflow hidden
      box-sizing: content-box
      &::after
        content ''
        left 12px
        bottom 13px
        position absolute
        width calc(100% - 24px)
        height 100%
        border-radius 0 0 54px 54px
        background-color var(--bg-color)
        border 1px solid #fafbfc
</style>
