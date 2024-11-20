const website = require('@mpxjs/vuese-website').default
const path = require('path')

// import website from '@mpxjs/vuese-website'
// import { fileURLToPath } from 'url'
// import path, { dirname } from 'path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

website({
  srcDirPath: path.resolve(__dirname, './src'),
  exampleDirPath: path.resolve(__dirname, './pages'),
  outputPath: path.resolve(__dirname, './docs/components'),
  doscPath: path.resolve(__dirname, './docs'),
})
