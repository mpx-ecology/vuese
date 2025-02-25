import mpx, { createPage, ref, onMounted, onUnmounted } from '@mpxjs/core'
import { syncPathToChild } from '@mpxjs/vuese-website/dist/iframe-sync'
import demoConfig from '../common/config'

const SCROLL_KEY = '___scoll_top___'
const isIframe = __mpx_mode__ === 'web' && window.parent !== window

createPage({
  setup(props, context) {
    const onClick = (item: string) => {
      const component = `${item.replace(/\(.*\)/, '')}`
      const route = `./${component}/index`
      if (__mpx_mode__ === 'web' && window.parent !== window) {
        syncPathToChild(component)
        return
      }
      mpx.navigateTo({
        url: route
      })
    }

    const show = ref(true)
    const handleScroll = () => {
      localStorage.setItem(SCROLL_KEY, String(document.documentElement.scrollTop))
    }
    if (isIframe) {
      show.value = false
      window.addEventListener('scroll', handleScroll)
      window.onbeforeunload = () => {
        localStorage.setItem(SCROLL_KEY, '0')
      }
    }

    onMounted(() => {
      if (isIframe) {
        setTimeout(() => {
          show.value = true
          document.documentElement.scrollTop = Number(localStorage.getItem(SCROLL_KEY))
        })
      }
    })

    onUnmounted(() => {
      if (isIframe) {
        window.removeEventListener('scroll', handleScroll)
      }
    })

    return {
      show,
      componentList: demoConfig.entryMap.introduce,
      onClick
    }
  }
})
