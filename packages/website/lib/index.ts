import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { parser } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'
import { markdownRenderConfig } from './contants'

type WebsiteConfig = {
  srcPath: string
  examplePath: string
  outputPath: string
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

function delScriptJsonBlock(content: string) {
  const jsonBlockReg = /<script\s[\w\s]*(name=["']json["']|type=["']application\/json["'])(\s|[\w\s])*>[\s\S]*<\/script>/
  return content.replace(jsonBlockReg, '')
}

function delEmptyContentLineBreaks(content: string) {
  const scriptContentReg = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/ig
  const regRes = content.match(scriptContentReg)
  if (!regRes) return ''
  const scriptContent = regRes[0]
  const isEmpty = scriptContent && scriptContent.replace('\n', '').length === 0
  if (isEmpty) {
    return content.replace(scriptContentReg, '')
  }
  return content
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

  const list = srcFiles.map(file => {
    let content = fs.readFileSync(file.fullPath, 'utf-8')
    content = delScriptJsonBlock(content)
    content = delEmptyContentLineBreaks(content)
    const res = parser(content, {
      isMpx: true,
      basedir: path.dirname(file.fullPath)
    })
    return {
      parseResult: res,
      fileName: file.fileName
    }
  })
  list.forEach(item => {
    // eslint-disable-next-line
    // @ts-ignore
    const render = new Render(item.parseResult, Object.assign({ name: item.fileName }, markdownRenderConfig))
    fs.writeFileSync(`${config.outputPath}/${item.fileName}.md`, render.renderMarkdown('zh')!.content)
  })
  
  // 启动 VitePress 开发服务器
  spawn('npx', ['vitepress', 'dev', 'docs'], { stdio: 'inherit' });
  // 构建 VitePress 静态文件
  // spawn('npx', ['vitepress', 'build', 'docs'], { stdio: 'inherit' });
}
