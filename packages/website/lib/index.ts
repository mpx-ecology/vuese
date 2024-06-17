import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { parser, type ParserResult } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'

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

function delScriptJsonBlock(content) {
  const jsonBlockReg = /<script\s[\w\s]*(name=["']json["']|type=["']application\/json["'])(\s|[\w\s])*>[\s\S]*<\/script>/
  return content.replace(jsonBlockReg, '')
}

function readFileSync(path) {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf-8')
  }
  return ''
}

const delEmptyContentLineBreaks = function (content) {
  const scriptContentReg = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/ig
  const scriptContent = content.match(scriptContentReg)[0]
  const isEmpty = scriptContent && scriptContent.replace('\n', '').length === 0
  if (isEmpty) {
    return content.replace(scriptContentReg, '')
  }
  return content
}

function listMpxFiles(dir, fileName = '') {
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

export default function website(config: WebsiteConfig): void {
  if (!validateParams(config)) {
    return
  }
  
  const mpxFiles = listMpxFiles(config.srcPath);
  
  const list: {
    parseResult: ParserResult,
    fileName: string
  }[] = []
  mpxFiles.forEach(file => {
    let content = readFileSync(file.fullPath)
    content = delScriptJsonBlock(content)
    content = delEmptyContentLineBreaks(content)
    const res = parser(content, {
      isMpx: true,
      basedir: path.dirname(file.fullPath)
    })
    list.push({
      parseResult: res,
      fileName: file.fileName
    })
  })
  
  list.forEach((item, index) => {
    // eslint-disable-next-line
    // @ts-ignore
    const render = new Render(item.parseResult, Object.assign({
      name: index
    }, {
      props: [
        {
          type: 'Name',
          zh: '参数',
          en: 'Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Type',
          zh: '类型',
          en: 'Type'
        },
        {
          type: 'Optional',
          zh: '可选值',
          en: 'Optional'
        },
        {
          type: 'Default',
          zh: '默认值',
          en: 'Default'
        }
        // {
        //   type: 'Wx',
        //   zh: '微信',
        //   en: 'WeChat'
        // },
        // {
        //   type: 'Web',
        //   zh: 'web',
        //   en: 'web'
        // },
        // {
        //   type: 'Ali',
        //   zh: '支付宝',
        //   en: 'Alipay'
        // }
      ],
      slots: [
        {
          type: 'Name',
          zh: '插槽名',
          en: 'Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        }
        // {
        //   type: 'Default',
        //   zh: '默认值',
        //   en: 'Default Slot Content'
        // }
      ],
      methods: [
        {
          type: 'Name',
          zh: '组件实例方法',
          en: 'Method Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Parameters',
          zh: '参数',
          en: 'Parameters'
        },
        {
          type: 'Return',
          zh: '返回值',
          en: 'Return'
        }
      ],
      events: [
        {
          type: 'Name',
          zh: '事件名',
          en: 'Method Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Parameters',
          zh: '参数',
          en: 'Parameters'
        }
      ],
      mixIns: [
        {
          type: 'Name',
          zh: '参数',
          en: 'Name'
        }
      ]
    }))
    fs.writeFileSync(`${config.outputPath}/${item.fileName}.md`, render.renderMarkdown('zh')!.content)
  })
  
  // 启动 VitePress 开发服务器
  spawn('npx', ['vitepress', 'dev', 'docs'], { stdio: 'inherit' });
  // 构建 VitePress 静态文件
  // spawn('npx', ['vitepress', 'build', 'docs'], { stdio: 'inherit' });
}
