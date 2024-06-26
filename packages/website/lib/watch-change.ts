import nodeWatch from 'node-watch'
import { getCache } from './cache'
import { genExampleMd } from './gen-example-md'
import { genSrcMd } from './gen-src-md'
import { getFiles } from './get-files-list'
import fs from 'fs'
import path from 'path'

export function watch(
  config: Record<'srcPath'|'examplePath'|'outputPath', string>
) {
  const cache = getCache()
  nodeWatch([config.srcPath, config.examplePath], { recursive: true }, async function (evt, changeFilePath) {
    if (evt === 'update') {
      const isSrcChange = changeFilePath.includes(config.srcPath)
      const isExampleChange = changeFilePath.includes(config.examplePath)
      const srcFiles = getFiles(config.srcPath, config.examplePath)

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
        md = genExampleMd(fileName, path.resolve(config.examplePath, fileName))
        cache[fileName].exampleMd = md
      }
      fs.writeFileSync(`${config.outputPath}/${fileName}.md`, cache[fileName].exampleMd + '\n' + cache[fileName].srcMd)
    }
  })
}
