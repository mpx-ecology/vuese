import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { genSrcMd } from './gen-src-md'
import { genExampleMd } from './gen-example-md'
import { watch, type StringToArr } from './watch-change'
import { getFiles } from './get-files-list'
import { getCache } from './cache'

export type WebsiteConfig = {
  command: 'dev'|'build',
  srcDirPath: string|string[]
  exampleDirPath: string|string[]
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
  if (config.srcDirPath.length !== config.exampleDirPath.length) {
    console.error('请确保 srcDirPath 和 exampleDirPath 的个数相同')
    return false
  }
  keys.forEach(key => {
    if (!config[key]) {
      total.push(key)
    }
    try {
      if (typeof config[key] === 'string')  {
        const stat = fs.statSync(config[key] as fs.PathLike)
        if (!stat.isDirectory()) {
          dir.push(key)
        }
      } else {
        (config[key] as string[]).forEach(item => {
          const stat = fs.statSync(item)
          if (!stat.isDirectory()) {
            dir.push(key)
          }
        })
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
  config = { ...config }
  if (typeof config.srcDirPath === 'string') config.srcDirPath = [config.srcDirPath]
  if (typeof config.exampleDirPath === 'string') config.exampleDirPath = [config.exampleDirPath]

  if (!validateParams(config)) return
  const srcFiles = getFiles(config.srcDirPath, config.exampleDirPath)

  const cache = getCache()
  srcFiles.forEach((item, index) => {
    item.forEach(file => {
      const fileName = file.fileName
      const srcMd = genSrcMd(fileName, file.fullPath)
      const exampleMd = genExampleMd(fileName, path.resolve(config.exampleDirPath[index], fileName))
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
  })

  watch(config as unknown as StringToArr<WebsiteConfig>)

  // 启动 VitePress 开发服务器
  const child = spawn('npx', ['vitepress', config.command || 'dev', config.doscPath || 'docs'], { stdio: 'inherit' });
  child.on('close', (code) => {
    if (code === 0) process.exit(0)
  })
  // 构建 VitePress 静态文件
  // spawn('npx', ['vitepress', 'build', 'docs'], { stdio: 'inherit' });
}
