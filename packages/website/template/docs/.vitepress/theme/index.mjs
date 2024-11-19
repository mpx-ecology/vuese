import VueseWebsiteTheme from '@mpxjs/vuese-website/dist/theme/index'
import Layout from '@mpxjs/vuese-website/dist/theme/layouts/Layout.vue'
import Card from '@mpxjs/vuese-website/dist/theme/global-components/Card.vue'
import '@mpxjs/vuese-website/dist/theme/styles/vars.css'

export default {
  extend: VueseWebsiteTheme,
  Layout,
  enhanceApp({ router, app }) {
    app.component('Card', Card)
  },
  themeConfig: {}
}
