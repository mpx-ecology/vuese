const { resolve } = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const dts = require('dts-bundle')
const chalk = require('chalk')
const packagesDir = resolve('packages')

const buildTargets = process.argv.slice(2)
const isBuildAll = buildTargets.length === 0

function logger(msg) {
  return console.log(chalk.blue(chalk.bold(msg)))
}

function makeBuild() {
  const files = ['parser', 'markdown-render']

  const build = async pkgDirName => {
    logger(`Start building, Targets: ${pkgDirName}`)
    const pkgDir = resolve(packagesDir, pkgDirName)
    const pkgMeta = require(`${pkgDir}/package.json`)
    if (pkgMeta.private) return
    await fs.remove(`${pkgDir}/dist`)
    await execa('rollup', ['-c', '--environment', `PKG_DIR:${pkgDirName}`], {})

    const dtsOutDir = `${pkgDir}/${pkgMeta.types}`

    if (pkgMeta.buildOptions.extractDts) {
      dts.bundle({
        name: pkgMeta.name,
        main: `${pkgDir}/dist/packages/${pkgDirName}/lib/index.d.ts`,
        out: dtsOutDir
      })
    }
    await fs.remove(`${pkgDir}/dist/packages`)

    if (pkgDirName === 'cli') {
      await fs.copy(`${pkgDir}/lib/templates`, `${pkgDir}/dist/templates`)
    }
  }

  Promise.all(
    files.map(item => build(item))
  ).then(() => {
    build('website')
  })
}

makeBuild()
