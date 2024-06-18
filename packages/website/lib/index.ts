import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { genSrcMd } from './gen-src-md'

type WebsiteConfig = {
  srcPath: string
  examplePath: string
  outputPath: string
  doscPath: string
}


function validateParams(config: WebsiteConfig) {
  const keys: (keyof WebsiteConfig)[] = ['srcPath', 'examplePath', 'outputPath']
  const total: typeof keys = []
  keys.reduce((total, key) => {
    if (!config[key]) {
      total.push(key)
    }
    return total
  }, total)

  if (total.length) {
    console.error(`请输入${total.join(', ')}参数`)
    return false
  }

  return true
}

function listMpxFiles(dir: string, fileName = '') {
  let results: Record<'fullPath'|'fileName', string>[] = []
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


function getFiles(srcPath: string, examplePath: string) {
  const srcFiles = listMpxFiles(srcPath)
  const exapmpleFiles = fs.readdirSync(examplePath)

  return srcFiles.filter(item => {
    return exapmpleFiles.includes(item.fileName)
  })
}

export default function website(config: WebsiteConfig): void {
  if (!validateParams(config)) return

  const srcFiles = getFiles(config.srcPath, config.examplePath)

  srcFiles.map(file => {
    const md = genSrcMd(file.fileName, file.fullPath)
    md.then(text => {
      fs.writeFileSync(`${config.outputPath}/${file.fileName}.md`, text)
    })
  })

  // 启动 VitePress 开发服务器
  spawn('npx', ['vitepress', 'dev', config.doscPath || 'docs'], { stdio: 'inherit' });
  // 构建 VitePress 静态文件
  // spawn('npx', ['vitepress', 'build', 'docs'], { stdio: 'inherit' });
}
