import path from 'path'
import { delScriptJsonBlock, readFileSync, getExamplesMpxFiles } from '../utils/index'
import { addExampleToMd } from '../lib/extractor'


export function genExampleMd(fileName: string, examplePath: string) {
  const mpxFiles = getExamplesMpxFiles(examplePath)
  const nameContentMap = {}
  const mdFile = path.resolve(examplePath, 'README.md')
  const mdContent = readFileSync(mdFile)
  mpxFiles.forEach(file => {
    const key = file.split('.')[0]
    if (key === 'index') {
      return
    }
    nameContentMap[key] = delScriptJsonBlock(readFileSync(path.resolve(examplePath, file)))
  })  
  const content = addExampleToMd(mdContent, nameContentMap, 'default')
  return content
}
