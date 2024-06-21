import DefaultTheme from 'vitepress/theme'
// import { defineConfig } from 'vitepress'
import Layout from './layouts/Layout.vue'


export default {
  extend: DefaultTheme,
  Layout: Layout,
  enhanceApp({ router }) {
    router.go('/mpx-ui/guide/button.html')
  }
}
