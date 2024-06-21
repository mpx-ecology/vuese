import VueseWebsiteTheme from '@mpxjs/vuese-website/dist/theme/index'
import Layout from '@mpxjs/vuese-website/dist/theme/layouts/Layout.vue'

export default {
  extend: VueseWebsiteTheme,
  Layout: Layout,
  enhanceApp({ router }) {
    router.go('/mpx-ui/guide/button.html')
  }
}
