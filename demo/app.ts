import mpx, { createApp } from '@mpxjs/core'
import apiProxy from '@mpxjs/api-proxy'

mpx.use(apiProxy, { usePromise: true })

// app.js
createApp({})

const isIframe = __mpx_mode__ === 'web' && window.parent !== window

if (isIframe) {
  let prevPath = ''
  const handleMessage = (e) => {
    const { to } = (typeof e.data === 'object' ? e.data : {}) as any
    if (to !== undefined && to !== prevPath) {
      mpx.redirectTo({
        url: `/pages/${to && to !== 'intro' ? `${to}/` : ''}index`
      })
      prevPath = to
    }
  }
  window.addEventListener('message', handleMessage)
}
