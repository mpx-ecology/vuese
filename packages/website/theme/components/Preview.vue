<template>
  <div ref="containerRef" class="preview-container">
    <div class="preview" ref="previewRef" v-show="showSimulator">
      <span class="current-time">{{ time }}</span>
      <header class="header">
        <i
          class="cubeic cubeic-back"
          v-show="showBack"
          @click="history.back()"
        />
        {{ title }}
      </header>
      <div class="simulator-wrapper">
        <iframe
          ref="simulatorRef"
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

<script setup>
import { throttle } from 'lodash-es'
import { EXAMPLE_DOC_PORT } from '../config/index'
import { useData } from 'vitepress'
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'

/**
 * 轮询
 * @param cb
 * @param delay
 * @returns
 */
const polling = (cb, delay = 3000) => {
  let firstCall = true
  const timerRef = {
    value: -1
  }
  const pollingFunc = function(...args) {
    if (firstCall) {
      firstCall = false
      cb.call(this, ...args)
    }
    clearTimeout(timerRef.value)
    timerRef.value = setTimeout(() => {
      cb.call(this, ...args)
      pollingFunc(...args)
    }, delay)
    return timerRef
  }
  return pollingFunc
}

const getTime = () => {
  const now = new Date()
  return `${`${now.getHours()}`.padStart(
    2,
    0
  )}:${`${now.getMinutes()}`.padStart(2, 0)}`
}

const time = ref(getTime())

let componentName = ''
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${EXAMPLE_DOC_PORT}/`
    : `/mpx-cube-ui/example/index.html`

const previewPath = computed(() => {
  if (componentName) {
    return `${baseUrl}#/pages/${componentName}/index`
  }
  return baseUrl
})

const getComponent = list => {
  if (!Array.isArray(list)) {
    return null
  }
  for (const item of list) {
    if (location.href.includes(`${item.text}.html`)) {
      return item.title
    }
    const title = getComponent(item.items)
    if (title) {
      return title
    }
  }
  return null
}

let flush = 1
const { theme } = useData()
const title = computed(() => {
  if (!flush) {
    return ''
  }
  return (
    getComponent([theme.value.sidebar.find(item => item.text === 'button')]) ||
    'test'
  )
})

const showBack = computed(() => {
  return title !== 'test'
})

const router = useRouter()
const route = useRoute()
watch(
  () => route.path,
  (newPath, oldPath) => {
    flush += 1
    syncChildPath(newPath)
  }
)

//created
const showSimulator = ref(false)
const img = new Image()
const show = () => {
  showSimulator.value = true
  setTimeout(() => {
    handleResize()
  })
}
img.src = ''
img.onload = show
img.onerror = show
let timer = null
timer = polling(() => {
  time.value = getTime()
}, 6000)()

const handleMessage = e => {
  if (e.data?.component !== undefined) {
    if (!e.data?.component) {
      router.go('/guide/button.html')
      return
    }
    const data = e.data
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

const getComponentName = path => {
  let componentName = ''
  const [_, componentPath] = path.split('mpx-ui')
  if (!componentPath) {
    return componentName
  }
  componentPath.replace(/\/(.*?).html/, (_, res) => {
    if (res.indexOf('/') > 0) {
      componentName = res.split('/')[1]
    } else {
      componentName = res
    }
  })
  return componentName
}

const containerRef = ref(null)
const previewRef = ref(null)
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

const simulatorRef = ref(null)
const syncChildPath = to => {
  const componentUrl = to.split('/mpx-ui')[1]
  simulatorRef.value.contentWindow.postMessage(
    {
      to: getComponentName(componentUrl)
    },
    '*'
  )
}
onMounted(() => {
  componentName = getComponentName(top.location.href)
  handleResize()
  calcPreviewerPosition()
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', calcPreviewerPosition)
  simulatorRef.value.onload = () => {
    syncChildPath(router.route.path)
  }
})

onUnmounted(() => {
  clearTimeout(timer.value)
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
