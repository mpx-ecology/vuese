import { getBabelParserPlugins } from './sfcToAST'
import { parse as babelParse } from '@babel/parser'
import type { AstResult } from './sfcToAST'
import type { ParserOptions} from './index'

export function scriptToAst(source: string, options: ParserOptions): AstResult {
  const plugins = getBabelParserPlugins(options.babelParserPlugins)
  const res: AstResult = { jsSource: '', templateSource: '' }
  res.sourceType = options.filepath ? options.filepath.slice(-2) : ''
  res.jsSource = source
  res.jsAst = babelParse(source, {
    sourceType: 'module',
    plugins
  })
  res.templateSource = ''
  return res
}
