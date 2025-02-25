import fs from 'fs'
import path from 'path'

function listMpxFiles(dir: string, fileName = '') {
  let results: Record<'fullPath' | 'fileName', string>[] = []
  fs.readdirSync(dir).forEach(subFileName => {
    const fullPath = path.join(dir, subFileName);
    if (fs.lstatSync(fullPath).isDirectory()) {
      results = results.concat(listMpxFiles(fullPath, subFileName));
    } else {
      if (subFileName.endsWith('.mpx')) {
        results.push({
          fullPath,
          fileName
        });
      }
    }
  })

  return results;
}


const _cacheList: Record<"fullPath" | "fileName", string>[][] = []
export function getFiles(srcPath: string[], examplePath: string[]) {
  if (_cacheList.length) return _cacheList

  srcPath.forEach((_, index) => {
    const srcFiles = listMpxFiles(srcPath[index])
    const exampleFiles = fs.readdirSync(examplePath[index])
  
    _cacheList.push(srcFiles.filter(item => {
      return exampleFiles.includes(item.fileName)
    }))
  })
  return _cacheList
}
