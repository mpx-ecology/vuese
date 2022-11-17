import { sfcToAST } from './sfcToAST'
import type { AstResult } from './sfcToAST'
import { scriptToAst } from './scriptToAST'
import { parseJavascript, setOptionsLevel } from './parseJavascript'
import { parseTemplate } from './parseTemplate'
import { CommentResult } from './jscomments'
import { Seen } from './seen'
import { mergeMixinsOptions } from './processMixins'

export * from './sfcToAST'
export * from './parseJavascript'
export * from './parseTemplate'
export * from './helper'
export * from './jscomments'
export * from './getExportFileConfig'
export {
  mergeMixinsOptions
}

export type PropType = string | string[] | null

/**
 * Since version 7.3.3, `type ParserPlugin` has been added with the `ParserPluginWithOptions` type,
 * which is a breaking change for vuese, so we will force the installation of the version below 7.3.3,
 * and the overall upgrade will follow.
 * https://github.com/babel/babel/blob/master/packages/babel-parser/typings/babel-parser.d.ts#L118
 */
type ParserPlugin =
  | 'estree'
  | 'jsx'
  | 'flow'
  | 'flowComments'
  | 'typescript'
  | 'doExpressions'
  | 'objectRestSpread'
  | 'decorators'
  | 'decorators-legacy'
  | 'classProperties'
  | 'classPrivateProperties'
  | 'classPrivateMethods'
  | 'exportDefaultFrom'
  | 'exportNamespaceFrom'
  | 'asyncGenerators'
  | 'functionBind'
  | 'functionSent'
  | 'dynamicImport'
  | 'numericSeparator'
  | 'optionalChaining'
  | 'importMeta'
  | 'bigInt'
  | 'optionalCatchBinding'
  | 'throwExpressions'
  | 'pipelineOperator'
  | 'nullishCoalescingOperator'
export type BabelParserPlugins = { [key in ParserPlugin]?: boolean }

export interface EventNameMap {
  [key: string]: string
}

interface CommonResult {
  name: string
  level?: number
  describe?: string[] | CommentResult
  version?: string[]
}

export interface PropsResult extends CommonResult {
  type: PropType
  typeDesc?: string[]
  required?: boolean
  default?: string
  defaultDesc?: string[]
  validator?: string
  validatorDesc?: string[]
}

export interface EventResult extends CommonResult {
  isSync: boolean
  syncProp: string
  argumentsDesc?: string[]
}

export interface MethodResult extends CommonResult {
  argumentsDesc?: string[]
  returnDesc?: string[]
}

export interface ComputedResult {
  name: string
  type?: string[]
  describe?: string[]
  isFromStore: boolean
}

export interface MixInResult {
  mixIn: string
}

export interface DataResult {
  name: string
  type: string
  describe?: string[]
  default?: string
}

export interface WatchResult {
  name: string
  describe?: string[]
  argumentsDesc?: string[]
}

export type AttrsMap = Record<string, string>

export interface SlotResult {
  name: string
  describe: string
  backerDesc: string
  bindings: AttrsMap
  scoped: boolean
  target: 'template' | 'script',
  version?: string[]
}

export interface ExternalClassesResult {
  name: string
  describe: string[]
}

export interface ParserOptions {
  isMpx?: boolean
  isMixin?: boolean
  filepath?: string
  jsFilePath?: string
  fnMixins?: Record<string, {
    mixins: string[],
    vueseRes: ParserResult
  }>
  onProp?: {
    (propsRes: PropsResult): void
  }
  onEvent?: {
    (eventRes: EventResult): void
  }
  onMethod?: {
    (methodRes: MethodResult): void
  }
  onComputed?: {
    (computedRes: ComputedResult): void
  }
  onMixIn?: {
    (mixInRes: MixInResult): void
  }
  onData?: {
    (dataRes: DataResult): void
  }
  onSlot?: {
    (slotRes: SlotResult): void
  }
  onName?: {
    (name: string): void
  }
  onDesc?: {
    (desc: CommentResult): void
  }
  onWatch?: {
    (watch: WatchResult): void
  }
  onExternalClasses?: {
    (externalClasses: ExternalClassesResult): void
  }
  babelParserPlugins?: BabelParserPlugins
  basedir?: string
  includeSyncEvent?: boolean
}

export interface ParserResult {
  props?: PropsResult[]
  events?: EventResult[]
  slots?: SlotResult[]
  mixIns?: MixInResult[]
  methods?: MethodResult[]
  computed?: ComputedResult[]
  data?: DataResult[]
  watch?: WatchResult[]
  name?: string
  componentDesc?: CommentResult
  externalClasses?: ExternalClassesResult[]
}

export function parser(
  source: string,
  options: ParserOptions = {}
): ParserResult {
  let astRes: AstResult
  if (options.isMixin) {
    astRes = scriptToAst(source, options)
  } else {
    astRes = sfcToAST(source, options.babelParserPlugins, options.basedir)
  }
  options.jsFilePath = astRes.jsFilePath
  const res: ParserResult = {}
  const defaultOptions: ParserOptions = {
    onName(name: string) {
      res.name = name
    },
    onDesc(desc: CommentResult) {
      res.componentDesc = desc
    },
    onProp(propsRes: PropsResult) {
      if (typeof propsRes.describe === 'object' && (propsRes.describe as CommentResult).dosHide) {
        return
      }
      ;(res.props || (res.props = [])).push(propsRes)
    },
    onEvent(eventsRes: EventResult) {
      ;(res.events || (res.events = [])).push(eventsRes)
    },
    onSlot(slotRes: SlotResult) {
      ;(res.slots || (res.slots = [])).push(slotRes)
    },
    onMixIn(mixInRes: MixInResult) {
      ;(res.mixIns || (res.mixIns = [])).push(mixInRes)
    },
    onMethod(methodRes: MethodResult) {
      (res.methods || (res.methods = [])).push(methodRes)
    },
    onComputed(computedRes: ComputedResult) {
      ;(res.computed || (res.computed = [])).push(computedRes)
    },
    onData(dataRes: DataResult) {
      ;(res.data || (res.data = [])).push(dataRes)
    },
    onWatch(watchRes: WatchResult) {
      ;(res.watch || (res.watch = [])).push(watchRes)
    },
    onExternalClasses(externalClassesRes: ExternalClassesResult) {
      ;(res.externalClasses || (res.externalClasses = [])).push(
        externalClassesRes
      )
    }
  }

  const finallyOptions: ParserOptions = { ...defaultOptions, ...options }
  const seenEvent = new Seen()
  let helpCreateName = ''
  if (astRes.jsAst) {
    setOptionsLevel(0)
    helpCreateName = parseJavascript(astRes.jsAst, seenEvent, finallyOptions, astRes.jsSource)
  }
  if (astRes.templateAst) {
    parseTemplate(astRes.templateAst, seenEvent, finallyOptions)
  }
  mergeMixinsOptions(res)
  if (helpCreateName && options.fnMixins) {
    const vueseRes = options.fnMixins[helpCreateName].vueseRes
    const keys = { props: '', methods: '', events: '' }
    Object.keys(keys).forEach(key => {
      if (res[key]) {
        res[key] = [...vueseRes[key], ...res[key]]
      } else {
        res[key] = vueseRes[key]
      }
    })
  }
  mergeMixinsOptions(res)
  return res
}
