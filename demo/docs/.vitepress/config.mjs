import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function init() {
  const dir = path.resolve('docs/guide')
  const list = fs.readdirSync(dir).map(item => {
    item = item.split('.')[0]
    return {
      text: item,
      link: `/guide/${item}`
    }
  })
  return defineConfig({
    base: '/zc-test/mpx-ui/dist',
    title: "My Awesome Project",
    description: "A VitePress Site",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Examples', link: '/markdown-examples' }
      ],
  
      sidebar: [
        {
          text: 'Examples',
          items: list
        }
      ],
  
      socialLinks: [
        { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      ]
    }
  })
}
// https://vitepress.dev/reference/site-config
export default init()
