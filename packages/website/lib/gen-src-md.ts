import path from 'path'
import fs from 'fs'
import { parser } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'
import { markdownRenderConfig } from './contants'
import hljs from 'highlight.js'
import dirtyJson from 'dirty-json'
import { delScriptJsonBlock, delEmptyContentLineBreaks } from '../utils/index'


export function genSrcMd(fileName: string, fullPath: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(fullPath, 'utf-8', (err, content) => {
      content = delScriptJsonBlock(content)
      content = delEmptyContentLineBreaks(content)
      const parserRes = parser(content, {
        isMpx: true,
        basedir: path.dirname(fullPath)
      })

      // 这里有坑，res的tsType是数组，但是里面的每个对象都是同一个地址
      const text: typeof parserRes = JSON.parse(JSON.stringify(parserRes))
      const optionalMark = '___'
      text.props?.forEach(item => {
        let _default = item.default
        if (!_default) return
        try {
          const defaultHandlerText = dirtyJson.parse(_default)
          if (typeof defaultHandlerText === 'object' && !Array.isArray(defaultHandlerText)) {
            _default = JSON.stringify(defaultHandlerText, null, 2)
          }
        } catch (error) {
          console.log(error)
        }
        _default = _default
          .replace(/&nbsp;/g, ' ')
          .replace(/<br>/g, '\n')
          .replace(/\?/g, optionalMark)
        _default = `<pre v-pre class="language-typescript inside-td"><code>${hljs.highlight(_default, { language: 'typescript' }).value}</code></pre>`
        _default = _default.replace(/:\s*([\w\\|]+);?/g, (m, $1) => {
          const types = $1.split('\\|')
          return m.replace($1, types.map(type => `<span class="hljs-built_in">${type}</span>`).join('\\|'))
        })
        item.default = _default.replace(/\n/g, '<br>').replace(new RegExp(optionalMark, 'g'), '?')
      })

      // eslint-disable-next-line
      // @ts-ignore
      const render = new Render(text, Object.assign({ name: fileName }, markdownRenderConfig))
      const md = render.renderMarkdown('zh')!.content
      resolve(md)
    })
  })
}
