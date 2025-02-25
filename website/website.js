const path = require('path')
const website = require('@mpxjs/vuese-website').default

website({
  srcDirPath: [
    path.resolve(__dirname, '../demo/src'),
    path.resolve(__dirname, '../demo/new-src')
  ],
  exampleDirPath: [
    path.resolve(__dirname, '../demo/pages'),
    path.resolve(__dirname, '../demo/new-pages'),
  ],
  outputPath: path.resolve(__dirname, './docs/components'),
  doscPath: path.resolve(__dirname, './docs'),
})
