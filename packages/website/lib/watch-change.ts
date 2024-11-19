import fs from 'fs'
import path from 'path'
import nodeWatch from 'node-watch'
import { getCache } from './cache'
import { genExampleMd } from './gen-example-md'
import { genSrcMd } from './gen-src-md'
import { getFiles } from './get-files-list'
import { WebsiteConfig } from './index'

export function watch(
  config: WebsiteConfig
) {
  const cache = getCache()
  nodeWatch([config.srcDirPath, config.exampleDirPath], { recursive: true }, async function (evt, changeFilePath) {
    if (evt === 'update') {
      const isSrcChange = changeFilePath.includes(config.srcDirPath)
      const isExampleChange = changeFilePath.includes(config.exampleDirPath)
      const srcFiles = getFiles(config.srcDirPath, config.exampleDirPath)

      const changeFile = srcFiles.find(({ fileName }) => {
        return changeFilePath.includes(`\/${fileName}\/`)
      })

      if (!changeFile) return

      const fileName = changeFile.fileName
      let md = ''
      if (isSrcChange) {
        md = await genSrcMd(fileName, changeFile.fullPath)
        cache[fileName].srcMd = md
      } else if (isExampleChange){
        md = genExampleMd(fileName, path.resolve(config.exampleDirPath, fileName))
        cache[fileName].exampleMd = md
      }
      fs.writeFileSync(`${config.outputPath}/${fileName}.md`, cache[fileName].exampleMd + '\n' + cache[fileName].srcMd)
    }
  })
}
