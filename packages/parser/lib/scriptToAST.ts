import { getBabelParserPlugins } from './sfcToAST'
import { parse as babelParse } from '@babel/parser'
import type { AstResult } from './sfcToAST'
import type { ParserOptions} from './index'
import * as path from 'path'

// type _ParserOptions = 

export function scriptToAst(source: string, options: ParserOptions): AstResult {
  const plugins = getBabelParserPlugins(options.babelParserPlugins)
  const res: AstResult = { jsFilePath: '', jsSource: '', templateSource: '' }
  res.sourceType = options.filepath ? options.filepath.slice(-2) : ''
  res.jsFilePath = path.resolve(options.filepath || '')
  res.jsSource = source
  res.jsAst = babelParse(source, {
    sourceType: 'module',
    plugins
  })
  res.templateSource = ''
  return res
}
