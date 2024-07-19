const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const isBuiltinModule = require('is-builtin-module')
const copy = require('rollup-plugin-copy')
function resolveInput(projectDir) {
  return path.resolve('packages', `${projectDir}/lib/index.ts`)
}

function resolveOutput(projectDir) {
  return path.resolve('packages', `${projectDir}/dist/index.js`)
}

const PKG_DIR = process.env.PKG_DIR
const pkgMeta = require(path.resolve(`packages`, `${PKG_DIR}/package.json`))

const plugins = [
  // resolve(),
  // commonjs(),
  // pluginJson(),
  typescript({
    tsconfig: `packages/${PKG_DIR}/tsconfig.json`
  })
]
if (PKG_DIR === 'website') {
  plugins.push(
    copy({
      targets: [
        { src: 'packages/website/theme', dest: 'packages/website/dist' }
      ]
    })
  )
}
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
  plugins,
  output: {
    file: resolveOutput(PKG_DIR),
    format: 'cjs',
    exports: 'named'
  },
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    warn(warning)
  }
}
