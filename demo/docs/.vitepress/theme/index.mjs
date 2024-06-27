import VueseWebsiteTheme from '@mpxjs/vuese-website/dist/theme/index'
import Layout from '../../../../packages/website/theme/layouts/Layout.vue'
import Card from '@mpxjs/vuese-website/dist/theme/global-components/Card.vue'

export default {
  extend: VueseWebsiteTheme,
  Layout: Layout,
  enhanceApp({ router, app }) {
    router.go('/mpx-ui/guide/button.html'),
    app.component('Card', Card)
  }
}
