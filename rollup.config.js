const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const isBuiltinModule = require('is-builtin-module')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const pluginJson = require('@rollup/plugin-json')
function resolveInput(projectDir) {
  return path.resolve('packages', `${projectDir}/lib/index.ts`)
}

function resolveOutput(projectDir) {
  return path.resolve('packages', `${projectDir}/dist/index.js`)
}

const PKG_DIR = process.env.PKG_DIR
const pkgMeta = require(path.resolve(`packages`, `${PKG_DIR}/package.json`))

module.exports = {
  input: resolveInput(PKG_DIR),
  external(id) {
    return (
      (pkgMeta.dependencies && !!pkgMeta.dependencies[id]) ||
      id === 'prismjs/components' ||
      id === 'vue-template-compiler/build' ||
      id === 'typedoc'
    )
  },
  plugins: [
    // resolve(),
    // commonjs(),
    // pluginJson(),
    typescript()
  ],
  output: {
    file: resolveOutput(PKG_DIR),
    format: 'cjs',
    exports: 'named'
  },
  onwarn(warning, warn) {
    console.log(warning, warn)
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    console.log('-------')
    warn(warning)
  }
}
