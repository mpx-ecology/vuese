<template>
  <div ref="containerRef" class="preview-container">
    <div class="preview" ref="previewRef">
      <span class="current-time"></span>
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
import { useData } from 'vitepress'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'
const route = useRoute()
const router = useRouter()
const back = () => {
  window.history.back()
}

const { theme, site } = useData()
const iframeConfig = computed(() => theme.value.iframeConfig)

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
  iframeRef.value?.contentWindow.postMessage({
    to: getComponentName(),
    origin: route.path
  }, '*')
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
  if (e.data?.component !== undefined) {
    if (!e.data?.component) {
      router.go('/guide/button.html')
      return
    }
    const data = e.data
    if (data.component) {
      router.go(`${data.component}.html`)
    }
    const findComponent = list => {
      if (!Array.isArray(list)) {
        return null
      }
      for (const item of list) {
        if (item.path?.endsWith(data.component)) {
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
      router.go(`${component.path}.html`)
    }
  }
}

window.addEventListener('message', handleMessage)

const containerRef = ref()
const previewRef = ref()
const calcPreviewerHeight = () => {
  const el = previewRef.value
  el.style.height = `${window.innerHeight - 110}px`
}
const calcPreviewerTransform = () => {
  let offset = 0
  const el = previewRef.value

  if (!el.offsetParent) {
    const container = containerRef.value
    const elOffsetLeft = el.offsetLeft
    const containerOffsetLeft = container.offsetLeft
    offset = containerOffsetLeft - elOffsetLeft
  } else {
    const clientRect = el.getBoundingClientRect()
    const innerWidth = window.innerWidth
    offset =
      clientRect.right < innerWidth ? 0 : clientRect.right - innerWidth + 24 // 24为右边距
  }
  // el.style.transform = `translateX(${offset}px)`
}
const handleResize = throttle(() => {
  calcPreviewerHeight()
  calcPreviewerTransform()
})
const calcPreviewerPosition = () => {
  let offset = 0
  const el = previewRef.value

  if (!el.offsetParent) {
    const container = containerRef.value
    const elOffsetLeft = el.offsetLeft
    const containerOffsetLeft = container.offsetLeft
    offset = containerOffsetLeft - elOffsetLeft
  } else {
    const clientRect = el.getBoundingClientRect()
    const innerWidth = window.innerWidth
    offset =
      clientRect.right < innerWidth ? 0 : clientRect.right - innerWidth + 24 // 24为右边距
  }
  // el.style.transform = `translateX(${offset}px)`
}

onMounted(() => {
  handleResize()
  calcPreviewerPosition()
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', calcPreviewerPosition)
  iframeRef.value.onload = () => {
    syncChildPath(router.route.path)
    showBackHandler(router.route.path)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', calcPreviewerPosition)
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
    // right 24px
    // safari shit
    width 360px
    min-width 360px
    min-height 560px
    max-height 667px
    background-color #fff
    border-radius 20px 20px 100px 100px
    // box-shadow 0 8px 12px #ebedf0
    background url(https://dpubstatic.udache.com/static/dpubimg/mTIQh7C_y7ah3bMFu0guA_iphoneX.png) no-repeat center 0
    background-size 100%
    padding 25px
    padding-top 54px
    box-sizing border-box
    .current-time
      position absolute
      left 38px
      top 28px
      width: 50px
      height: 20px
      font-size 12px
      font-weight 700
      padding 3px 10px
      color #a3a6a9
      background-color #edf0f4
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
