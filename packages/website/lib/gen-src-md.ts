import path from 'path'
import fs from 'fs'
import { parser } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'
import { markdownRenderConfig } from './contants'

function delScriptJsonBlock(content: string) {
  const jsonBlockReg = /<script\s[\w\s]*(name=["']json["']|type=["']application\/json["'])(\s|[\w\s])*>[\s\S]*<\/script>/
  return content.replace(jsonBlockReg, '')
}

function delEmptyContentLineBreaks(content: string) {
  const scriptContentReg = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/ig
  const regResult = content.match(scriptContentReg)
  if (!regResult) return ''
  const scriptContent = regResult[0]
  const isEmpty = scriptContent && scriptContent.replace('\n', '').length === 0
  if (isEmpty) {
    return content.replace(scriptContentReg, '')
  }
  return content
}

export function genSrcMd(fileName: string, fullPath: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(fullPath, 'utf-8', (err, content) => {
      content = delScriptJsonBlock(content)
      content = delEmptyContentLineBreaks(content)
      const parserRes = parser(content, {
        isMpx: true,
        basedir: path.dirname(fullPath)
      })
  
      // eslint-disable-next-line
      // @ts-ignore
      const render = new Render(parserRes, Object.assign({ name: fileName }, markdownRenderConfig))
      const md = render.renderMarkdown('zh')!.content
      resolve(md)
    })
  })
}
