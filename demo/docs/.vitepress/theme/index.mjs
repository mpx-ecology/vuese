import VueseWebsiteTheme from '@mpxjs/vuese-website/dist/theme/index'
import Layout from '../../../../packages/website/theme/layouts/Layout.vue'
import Card from '@mpxjs/vuese-website/dist/theme/global-components/Card.vue'
import { h } from 'vue'

export default {
  extend: VueseWebsiteTheme,
  Layout,
  enhanceApp({ router, app }) {
    router.go('/mpx-ui/guide/dialog.html'),
    app.component('Card', Card)
  },
  themeConfig: {
    testa: 123
  }
}
