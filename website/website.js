const path = require('path')
const website = require('@mpxjs/vuese-website').default

website({
  srcDirPath: path.resolve(__dirname, '../demo/src'),
  exampleDirPath: path.resolve(__dirname, '../demo/pages'),
  outputPath: path.resolve(__dirname, './docs/components'),
  doscPath: path.resolve(__dirname, './docs'),
})
