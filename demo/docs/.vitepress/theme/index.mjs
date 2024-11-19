import VueseWebsiteTheme from '@mpxjs/vuese-website/dist/theme/index'
import Layout from '../../../../packages/website/theme/layouts/Layout.vue'
import Card from '@mpxjs/vuese-website/dist/theme/global-components/Card.vue'

export default {
  extend: VueseWebsiteTheme,
  Layout,
  enhanceApp({ router, app }) {
    app.component('Card', Card)
  },
  themeConfig: {
    testa: 123
  }
}
