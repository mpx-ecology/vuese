import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { genSrcMd } from './gen-src-md'
import { genExampleMd } from './gen-example-md'
import { watch } from './watch-change'
import { getFiles } from './get-files-list'
import { getCache } from './cache'

export type WebsiteConfig = {
  command: 'dev'|'bulid',
  srcDirPath: string
  exampleDirPath: string
  outputPath: string
  doscPath: string,
  demo: {
    devPath: string
    prodPath: string
    demoMessageCb?: () => void
  }
}

function validateParams(config: WebsiteConfig) {
  const keys: ['srcDirPath', 'exampleDirPath', 'outputPath'] = ['srcDirPath', 'exampleDirPath', 'outputPath']
  const total: string[] = []
  const dir: string[] = []
  keys.forEach(key => {
    if (!config[key]) {
      total.push(key)
    }
    try {
      const stat = fs.statSync(config[key])
      if (!stat.isDirectory()) {
        dir.push(key)
      }
    } catch (error) {
      dir.push(key)
    }
    
  })

  if (total.length || dir.length) {
    total.length && console.error(`请输入${total.join(', ')}参数`)
    dir.length && console.error(`请创建${dir.join(', ')}目录`)
    return false
  }

  return true
}


export default function website(config: WebsiteConfig): void {  
  if (!validateParams(config)) return
  const srcFiles = getFiles(config.srcDirPath, config.exampleDirPath)
  
  const cache = getCache()
  srcFiles.map(file => {
    const fileName = file.fileName
    const srcMd = genSrcMd(fileName, file.fullPath)
    const exampleMd = genExampleMd(fileName, path.resolve(config.exampleDirPath, fileName))
    srcMd.then(text => {
      cache[fileName] = {
        srcMd: text,
        exampleMd: exampleMd
      }
      fs.writeFile(`${config.outputPath}/${fileName}.md`,  exampleMd + '\n' + text, {
        encoding: 'utf-8'
      }, () => {
      })
    })
  })

  watch(config)

  // 启动 VitePress 开发服务器
  const child = spawn('npx', ['vitepress', config.command || 'dev', config.doscPath || 'docs'], { stdio: 'inherit' });
  child.on('close', (code) => {
    if (code === 0) process.exit(0)
  })
  // 构建 VitePress 静态文件
  // spawn('npx', ['vitepress', 'build', 'docs'], { stdio: 'inherit' });
}
