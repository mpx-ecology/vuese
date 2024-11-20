const path = require('path')
const ts = require('rollup-plugin-typescript2')

const generateConfig = (input, output, external = [], plugins = []) => {
  return {
    input,
    output,
    external,
    plugins: [
      ts({
        tsconfig: path.resolve(__dirname, './tsconfig.json')
      }),
      ...plugins,
    ],
  }
}

module.exports = [
  generateConfig(path.resolve(__dirname, './lib/iframe-sync.ts'), {
    file: path.resolve(__dirname, './dist/iframe-sync.js'),
    format: 'es',
    name: 'websiteIframeSync'
  })
]
