const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

function resolve(file) {
  return path.resolve(__dirname, file)
}

module.exports = defineConfig({
  publicPath: `./`,
  outputDir: './dist/' + process.env.MPX_CURRENT_TARGET_MODE + '/',
  pluginOptions: {
    // 指向自定义主题文件
    // themeFilePath: themeFilePath(), // eg: [resolve('theme.styl')]
    mpx: {
      srcMode: 'wx',
      entry: resolve('app.mpx'),
      plugin: {
        // 是否生成用于测试的源文件/dist的映射表
        generateBuildMap: true
      }
    }
  },
  devServer: {
    port: 8090
  },
  chainWebpack(config) {
    config.module.rules.delete('svg')
  },
  configureWebpack: {
    plugins: [
      new webpack.ProgressPlugin()
    ]
  }
})
