import {
  ParserResult,
  MixInResult,
  PropsResult,
  SlotResult,
  EventResult,
  DataResult,
  MethodResult,
  ComputedResult,
  WatchResult,
  ExternalClassesResult
} from '@vuese/parser'
import renderMarkdown, { MarkdownResult } from './renderMarkdown'
import { propsHeadOptions, HeadOption } from './config'

export { MarkdownResult }

interface RenderOptions {
  props: HeadOption[]
  slots: string[]
  events: string[]
  methods: string[]
  computed: string[]
  mixIns: string[]
  data: string[]
  watch: string[]
  externalClasses: string[]
}

export interface RenderResult {
  props?: string
  slots?: string
  events?: string
  methods?: string
  computed?: string
  mixIns?: string
  data?: string
  watch?: string,
  externalClasses?: string
}



export class Render {
  public tableHeadLang = 'en'
  constructor(
    public parserResult: ParserResult,
    public options?: RenderOptions,
  ) {
    this.options = Object.assign(
      {},
      {
        props: propsHeadOptions,
        events: ['Event Name', 'Description', 'Parameters'],
        slots: ['Name', 'Description', 'Default Slot Content'],
        methods: ['Name', 'Description', 'Parameters'],
        computed: ['Name', 'Type', 'Description', 'From Store'],
        mixIns: ['MixIn'],
        data: ['Name', 'Type', 'Description', 'Default'],
        watch: ['Name', 'Description', 'Parameters'],
        externalClasses: ['Name', 'Description']
      },
      this.options
    )
  }

  render(): RenderResult {
    const {
      props,
      slots,
      events,
      methods,
      mixIns,
      data,
      computed,
      watch,
      externalClasses
    } = this.parserResult
    const md: RenderResult = {}
    if (props) {
      md.props = this.propRender(props)
    }
    if (slots) {
      md.slots = this.slotRender(slots)
    }
    if (events) {
      md.events = this.eventRender(events)
    }
    if (methods) {
      md.methods = this.methodRender(methods)
    }
    if (computed) {
      md.computed = this.computedRender(computed)
    }
    if (mixIns) {
      md.mixIns = this.mixInRender(mixIns)
    }
    if (data) {
      md.data = this.dataRender(data)
    }
    if (watch) {
      md.watch = this.watchRender(watch)
    }
    if (externalClasses) {
      md.externalClasses = this.externalClassesRender(externalClasses)
    }

    return md
  }

  propRender(propsRes: PropsResult[]) {
    const propConfig = (this.options as RenderOptions).props
    let code = this.renderTabelHeader(propConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))
    for (const propRes of propsRes) {
      const row: string[] = []
      for(const propHead of propConfig) {
        const type = typeof propHead === 'object' ? propHead['type'] : propHead
        switch(type) {
          case 'Name':
            row.push(propRes.name)
            break
          case 'Wx':
          case 'Ali':
          case 'Web':
          // case 'required':
            if(Array.isArray(propRes.describe)) {
              row.push('-')
            } else {
              const key = (propRes.describe as any)[propHead.type]
              if(key) {
                row.push(key[0] === 'true' ? '✔': '-')
              } else {
                row.push('-')
              }
            }
            break
          case 'Description':
            let desc: string[] = ['-']
            if(Array.isArray(propRes.describe)) {
              if(propRes.describe.length) {
                desc = propRes.describe
              } 
            } else {
              const description = (propRes.describe as any).description as string[]
              desc = description || desc
            }
            if(propRes.validatorDesc) {
              if(desc[0] === '-') {
                desc = propRes.validatorDesc
              } else {
                desc = desc.concat(propRes.validatorDesc)
              }
            }
            row.push(desc.join(' '))
            break
          case 'Type':
            if (propRes.typeDesc) {
              row.push(propRes.typeDesc.join(' '))
            } else if (!propRes.type) {
              row.push('—')
            } else if (typeof propRes.type === 'string') {
              row.push(`\`${propRes.type}\``)
            } else if (Array.isArray(propRes.type)) {
              row.push(
                propRes.type
                  .map(t => `\`${t}\` / `)
                  .join(' ')
                  .slice(0, -3)
              )
            } else {
              row.push('-')
            }
            break
          case 'Default':
            if (propRes.defaultDesc) {
              row.push(propRes.defaultDesc.join(' '))
            } else if (propRes.default) {
              row.push(
                typeof propRes.default === 'object'
                  ? JSON.stringify(propRes.default)
                  : propRes.default
              )
            } else {
              row.push('-')
            }
            break
          case 'Optional':
            if(Array.isArray(propRes.describe)) {
              row.push('-')
            } else {
              const optional = (propRes.describe as any).optional
              if (optional) {
                const optionalValues = (propRes.describe as any).optional[0] as string
                row.push(optionalValues)
              } else {
                row.push('-')
              }
            }
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    }
    return code
  }

  slotRender(slotsRes: SlotResult[]) {
    const slotConfig = (this.options as RenderOptions).slots
    let code = this.renderTabelHeader(slotConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    // If the template and script contain slots with the same name,
    // only the slots in the template are rendered
    const slotInTemplate: SlotResult[] = []
    const slotInScript: SlotResult[] = []
    slotsRes.forEach((slot: SlotResult) => {
      slot.target === 'template'
        ? slotInTemplate.push(slot)
        : slotInScript.push(slot)
    })

    slotsRes = slotInTemplate.concat(
      slotInScript.filter(ss => {
        for (let i = 0; i < slotInTemplate.length; i++) {
          if (ss.name === slotInTemplate[i].name) return false
        }
        return true
      })
    )

    slotsRes.forEach((slot: SlotResult) => {
      const row: string[] = []
      for (let i = 0; i < slotConfig.length; i++) {
        const type = typeof slotConfig[i] === 'object' ? slotConfig[i]['type'] : slotConfig[i]
        switch (type) {
          case 'Name':
            row.push(slot.name)
            break
          case 'Description':
            if (slot.describe) {
              row.push(slot.describe)
            } else {
              row.push('-')
            }
            break
          case 'Default Slot Content':
            if (slot.backerDesc) {
              row.push(slot.backerDesc)
            } else {
              row.push('-')
            }
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  eventRender(propsRes: EventResult[]) {
    const eventConfig = (this.options as RenderOptions).events
    let code = this.renderTabelHeader(eventConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    propsRes.forEach((event: EventResult) => {
      const row: string[] = []
      for (let i = 0; i < eventConfig.length; i++) {
        const type = typeof eventConfig[i] === 'object' ? eventConfig[i]['type'] : eventConfig[i]
        switch (type) {
          case 'Name':
            row.push(event.name)
            break
          case 'Description':
            if (event.describe && event.describe.length) {
              row.push(event.describe.join(' '))
            } else {
              row.push('-')
            }
            break
          case 'Parameters':
            if (event.argumentsDesc) {
              row.push(event.argumentsDesc.join(' '))
            } else {
              row.push('-')
            }
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  methodRender(methodsRes: MethodResult[]) {
    const methodConfig = (this.options as RenderOptions).methods
    // let code = this.renderTabelHeader(methodConfig)
    const codeArr: string[][] = []
    let maxParamsLength = 1
    methodsRes.forEach((method: MethodResult) => {
      const row: string[] = []
      for (let i = 0; i < methodConfig.length; i++) {
        const type = typeof methodConfig[i] === 'object' ? methodConfig[i]['type'] : methodConfig[i]
        switch (type) {
          case 'Name':
            row.push(method.name)
            break
          case 'Description':
            if (method.describe && method.describe.length) {
              row.push(method.describe.join(' '))
            } else {
              row.push('-')
            }
            break
          case 'Parameters':
            if (method.argumentsDesc) {
              maxParamsLength = Math.max(method.argumentsDesc.length, maxParamsLength)
              row.push(...method.argumentsDesc)
            } else {
              row.push('-')
            }
            break
          default:
            row.push('-')
        }
      }
      codeArr.push(row)
    })
    if (maxParamsLength > 1) {
      let startIndex = methodConfig.indexOf('Parameters')
      for (let i = 0; i < maxParamsLength; i++) {
        methodConfig[startIndex] = 'Parameters ' + (i + 1)
        startIndex++
      }
    }
    let code = this.renderTabelHeader(methodConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    codeArr.forEach(row => {
      code += this.renderTabelRow(row, methodConfig.length)
    })
    return code
  }

  computedRender(computedRes: ComputedResult[]) {
    const computedConfig = (this.options as RenderOptions).computed
    let code = this.renderTabelHeader(computedConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    computedRes.forEach((computed: ComputedResult) => {
      const row: string[] = []
      for (let i = 0; i < computedConfig.length; i++) {
        const type = typeof computedConfig[i] === 'object' ? computedConfig[i]['type'] : computedConfig[i]
        switch (type) {
          case 'Name':
            row.push(computed.name)
            break
          case 'Type':
            if (computed.type) {
              row.push(`\`${computed.type.join(' ')}\``)
              row.push()
            } else {
              row.push('-')
            }
            break
          case 'Description':
            if (computed.describe) {
              row.push(computed.describe.join(' '))
            } else {
              row.push('-')
            }
            break
          case 'From Store':
            if (computed.isFromStore) {
              row.push('Yes')
            } else {
              row.push('No')
            }
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  mixInRender(mixInsRes: MixInResult[]) {
    const mixInsConfig = (this.options as RenderOptions).mixIns
    let code = this.renderTabelHeader(mixInsConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    mixInsRes.forEach((mixIn: MixInResult) => {
      const row: string[] = []
      for (let i = 0; i < mixInsConfig.length; i++) {
        const type = typeof mixInsConfig[i] === 'object' ? mixInsConfig[i]['type'] : mixInsConfig[i]
        switch (type) {
          case 'MixIn':
            row.push(mixIn.mixIn)
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  dataRender(dataRes: DataResult[]) {
    const dataConfig = (this.options as RenderOptions).data
    let code = this.renderTabelHeader(dataConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    dataRes.forEach((data: DataResult) => {
      const row: string[] = []
      for (let i = 0; i < dataConfig.length; i++) {
        const type = typeof dataConfig[i] === 'object' ? dataConfig[i]['type'] : dataConfig[i]
        switch (type) {
          case 'Name':
            row.push(data.name)
            break
          case 'Description':
            if (data.describe) {
              row.push(data.describe.join(' '))
            } else {
              row.push('-')
            }
            break
          case 'Type':
            if (data.type.length > 0) {
              row.push(`\`${data.type}\``)
            } else {
              row.push('—')
            }
            break
          case 'Default':
            if (data.default) {
              row.push(data.default)
            } else {
              row.push('-')
            }
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  watchRender(watchRes: WatchResult[]) {
    const watchConfig = (this.options as RenderOptions).watch
    let code = this.renderTabelHeader(watchConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    watchRes.forEach((watch: WatchResult) => {
      const row: string[] = []
      for (let i = 0; i < watchConfig.length; i++) {
        const type = typeof watchConfig[i] === 'object' ? watchConfig[i]['type'] : watchConfig[i]
        switch (type) {
          case 'Name':
            row.push(watch.name)
            break
          case 'Description':
            if (watch.describe) {
              row.push(watch.describe.join(' '))
            } else {
              row.push('-')
            }
            break
          case 'Parameters':
            if (watch.argumentsDesc) {
              row.push(watch.argumentsDesc.join(' '))
            } else {
              row.push('-')
            }
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  externalClassesRender(externalClassRes: ExternalClassesResult[]) {
    const externalClassesConfig = (this.options as RenderOptions).externalClasses
    let code = this.renderTabelHeader(externalClassesConfig.map(item => typeof item === 'object' ? item[this.tableHeadLang]: item))

    externalClassRes.forEach((externalClass: ExternalClassesResult) => {
      const row: string[] = []
      for (let i = 0; i < externalClassesConfig.length; i++) {
        const type = typeof externalClassesConfig[i] === 'object' ? externalClassesConfig[i]['type'] : externalClassesConfig[i]
        switch (type) {
          case 'Name':
            row.push(externalClass.name)
            break
          case 'Description':
            row.push(externalClass.describe.length > 0 ? externalClass.describe.join(' ') : '-')
            break
          default:
            row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })
    return code
  }

  renderTabelHeader(header: string[]): string {
    const headerString = this.renderTabelRow(header)
    const splitLine = this.renderSplitLine(header.length)
    return headerString + splitLine + '\n'
  }

  renderTabelRow(row: string[], length?: number): string {
    let result =  row.map(n => {
      return `|${n}`
    }).join('')
    if (length && row.length < length) {
      result = result + '|-'.repeat(length - row.length)
    }
    return result + '|\n'
  }

  renderSplitLine(num: number): string {
    let line = ''
    for (let i = 0; i < num; i++) {
      line += '|---'
    }
    return line + '|'
  }

  renderMarkdown(lang = 'en', initialMd = ''): MarkdownResult | null {
    this.tableHeadLang = lang
    return renderMarkdown(this.render(), this.parserResult, initialMd)
  }
}

export default Render
