import fs from 'fs'
import path from 'path'
import nodeWatch from 'node-watch'
import { getCache } from './cache'
import { genExampleMd } from './gen-example-md'
import { genSrcMd } from './gen-src-md'
import { getFiles } from './get-files-list'
import { WebsiteConfig } from './index'

export type StringToArr<T extends Record<string, any>, K extends string = 'exampleDirPath'|'srcDirPath'> = {
  [Key in keyof T]: Key extends K ? string[] : T[Key]
}

export function watch(
  config: StringToArr<WebsiteConfig>
) {
  const cache = getCache()
  nodeWatch([...config.srcDirPath, ...config.exampleDirPath], { recursive: true }, async function (evt, changeFilePath) {
    if (evt === 'update') {
      const srcChangeIndex = config.srcDirPath.findIndex(item => {
        return changeFilePath.includes(item)
      })
      const exampleChangeIndex = config.exampleDirPath.findIndex(item => {
        return changeFilePath.includes(item)
      })
      const srcFiles = getFiles(config.srcDirPath, config.exampleDirPath)
      const index = Math.max(srcChangeIndex, exampleChangeIndex)
      const changeFile = srcFiles[index].find(({ fileName }) => {
        return changeFilePath.includes(`\/${fileName}\/`)
      })

      if (!changeFile) return

      const fileName = changeFile.fileName
      let md = ''
      if (srcChangeIndex >= 0) {
        md = await genSrcMd(fileName, changeFile.fullPath)
        cache[fileName].srcMd = md
      } else if (exampleChangeIndex >= 0){
        md = genExampleMd(fileName, path.resolve(config.exampleDirPath[index], fileName))
        cache[fileName].exampleMd = md
      }
      fs.writeFileSync(`${config.outputPath}/${fileName}.md`, cache[fileName].exampleMd + '\n' + cache[fileName].srcMd)
    }
  })
}
