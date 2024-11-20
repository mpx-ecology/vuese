import mpx, { createApp } from '@mpxjs/core'
import { onChildPathchange } from '@mpxjs/vuese-website/dist/iframe-sync'
import apiProxy from '@mpxjs/api-proxy'

mpx.use(apiProxy, { usePromise: true })

// app.js
createApp({})

const isIframe = __mpx_mode__ === 'web' && window.parent !== window

if (isIframe) {
  onChildPathchange((to) => {
    mpx.redirectTo({
      url: `/pages/${to && to !== 'intro' ? `${to}/` : ''}index`
    })
  })
}
