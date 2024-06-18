const website = require('@mpxjs/vuese-website').default
const path = require('path')

website({
  srcPath: path.resolve(__dirname, './src'),
  examplePath: path.resolve(__dirname, './pages'),
  outputPath: path.resolve(__dirname, './docs/guide'),
  doscPath: path.resolve(__dirname, './docs'),
})