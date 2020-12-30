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
import { propsHeadOptions, PropOption } from './config'

export { MarkdownResult }

interface RenderOptions {
  props: PropOption[]
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
        methods: ['Method', 'Description', 'Parameters'],
        computed: ['Computed', 'Type', 'Description', 'From Store'],
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
    let code = this.renderTabelHeader(propConfig.map(prop => prop[this.tableHeadLang]))
    for (const propRes of propsRes) {
      const row: string[] = []
      for(const propHead of propConfig) {
        switch(propHead.type) {
          case 'name':
            row.push(propRes.name)
            break
          case 'wx':
          case 'ali':
          case 'web':
          case 'required':
            if(Array.isArray(propRes.describe)) {
              row.push('-')
            } else {
              const key = propRes.describe?.[propHead.type][0]
              row.push(key === 'true' ? '✔': '-')
            }
            break
          case 'describe':
            let desc: string[] = ['-']
            if(Array.isArray(propRes.describe)) {
              if(propRes.describe.length) {
                desc = propRes.describe
              } 
            } else {
              desc = propRes.describe?.describe as string[]
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
          case 'type':
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
          case 'default':
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
          case 'optional':
            if(Array.isArray(propRes.describe)) {
              row.push('-')
            } else {
              const optionalValues = propRes.describe?.optional[0].split(' ').join(',') as string
              row.push(optionalValues)
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
    let code = this.renderTabelHeader(slotConfig)

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
        if (slotConfig[i] === 'Name') {
          row.push(slot.name)
        } else if (slotConfig[i] === 'Description') {
          if (slot.describe) {
            row.push(slot.describe)
          } else {
            row.push('-')
          }
        } else if (slotConfig[i] === 'Default Slot Content') {
          if (slot.backerDesc) {
            row.push(slot.backerDesc)
          } else {
            row.push('-')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  eventRender(propsRes: EventResult[]) {
    const eventConfig = (this.options as RenderOptions).events
    let code = this.renderTabelHeader(eventConfig)
    propsRes.forEach((event: EventResult) => {
      const row: string[] = []
      for (let i = 0; i < eventConfig.length; i++) {
        if (eventConfig[i] === 'Event Name') {
          row.push(event.name)
        } else if (eventConfig[i] === 'Description') {
          if (event.describe && event.describe.length) {
            row.push(event.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (eventConfig[i] === 'Parameters') {
          if (event.argumentsDesc) {
            row.push(event.argumentsDesc.join(' '))
          } else {
            row.push('-')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  methodRender(methodsRes: MethodResult[]) {
    const methodConfig = (this.options as RenderOptions).methods
    let code = this.renderTabelHeader(methodConfig)
    methodsRes.forEach((method: MethodResult) => {
      const row: string[] = []
      for (let i = 0; i < methodConfig.length; i++) {
        if (methodConfig[i] === 'Method') {
          row.push(method.name)
        } else if (methodConfig[i] === 'Description') {
          if (method.describe) {
            row.push(method.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (methodConfig[i] === 'Parameters') {
          if (method.argumentsDesc) {
            row.push(method.argumentsDesc.join(' '))
          } else {
            row.push('-')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  computedRender(computedRes: ComputedResult[]) {
    const computedConfig = (this.options as RenderOptions).computed
    let code = this.renderTabelHeader(computedConfig)
    computedRes.forEach((computed: ComputedResult) => {
      const row: string[] = []
      for (let i = 0; i < computedConfig.length; i++) {
        if (computedConfig[i] === 'Computed') {
          row.push(computed.name)
        } else if (computedConfig[i] === 'Type') {
          if (computed.type) {
            row.push(`\`${computed.type.join(' ')}\``)
            row.push()
          } else {
            row.push('-')
          }
        } else if (computedConfig[i] === 'Description') {
          if (computed.describe) {
            row.push(computed.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (computedConfig[i] === 'From Store') {
          if (computed.isFromStore) {
            row.push('Yes')
          } else {
            row.push('No')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  mixInRender(mixInsRes: MixInResult[]) {
    const mixInsConfig = (this.options as RenderOptions).mixIns
    let code = this.renderTabelHeader(mixInsConfig)
    mixInsRes.forEach((mixIn: MixInResult) => {
      const row: string[] = []
      for (let i = 0; i < mixInsConfig.length; i++) {
        if (mixInsConfig[i] === 'MixIn') {
          row.push(mixIn.mixIn)
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  dataRender(dataRes: DataResult[]) {
    const dataConfig = (this.options as RenderOptions).data
    let code = this.renderTabelHeader(dataConfig)
    dataRes.forEach((data: DataResult) => {
      const row: string[] = []
      for (let i = 0; i < dataConfig.length; i++) {
        if (dataConfig[i] === 'Name') {
          row.push(data.name)
        } else if (dataConfig[i] === 'Description') {
          if (data.describe) {
            row.push(data.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (dataConfig[i] === 'Type') {
          if (data.type.length > 0) {
            row.push(`\`${data.type}\``)
          } else {
            row.push('—')
          }
        } else if (dataConfig[i] === 'Default') {
          if (data.default) {
            row.push(data.default)
          } else {
            row.push('-')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  watchRender(watchRes: WatchResult[]) {
    const watchConfig = (this.options as RenderOptions).watch
    let code = this.renderTabelHeader(watchConfig)
    watchRes.forEach((watch: WatchResult) => {
      const row: string[] = []
      for (let i = 0; i < watchConfig.length; i++) {
        if (watchConfig[i] === 'Name') {
          row.push(watch.name)
        } else if (watchConfig[i] === 'Description') {
          if (watch.describe) {
            row.push(watch.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (watchConfig[i] === 'Parameters') {
          if (watch.argumentsDesc) {
            row.push(watch.argumentsDesc.join(' '))
          } else {
            row.push('-')
          }
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  externalClassesRender(externalClassRes: ExternalClassesResult[]) {
    const externalClassesConfig = (this.options as RenderOptions).externalClasses
    let code = this.renderTabelHeader(externalClassesConfig)
    externalClassRes.forEach((externalClass: ExternalClassesResult) => {
      const row: string[] = []
      for (let i = 0; i < externalClassesConfig.length; i++) {
        if (externalClassesConfig[i] === 'Name') {
          row.push(externalClass.name)
        } else if (externalClassesConfig[i] === 'Description') {
          row.push(externalClass.describe.length > 0 ? externalClass.describe.join(' ') : '-')
        } else {
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

  renderTabelRow(row: string[]): string {
    return row.map(n => `|${n}`).join('') + '|\n'
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
