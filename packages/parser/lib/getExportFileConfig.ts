import * as fs from 'fs'
import { parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { join as pathJoin, dirname as pathDirname } from 'path'
import { normalizePath } from './helper'

type Mixins = {
  name: string
  path: string
}[]

export function getExportFileConfig(mixinEntry: string): Mixins {
  const content = fs.readFileSync(mixinEntry, 'utf-8')
  const ast = babelParse(content, {
    sourceType: 'module',
    plugins: ['typescript']
  })
  return traverseAst(ast, mixinEntry)
}

function traverseAst(ast, filepath): Mixins {
  const mixins: Mixins = []
  traverse(ast, {
    ExportNamedDeclaration(rootPath) {
      let name = ''
      let mixinPath = ''
      rootPath.traverse({
        ExportSpecifier(path) {
          name = path.node.exported.name
        }
      })
      const source = rootPath.node.source
      if (source) {
        mixinPath = normalizePath(pathJoin(pathDirname(filepath), source.value))
      }
      mixins.push({
        name,
        path: mixinPath
      })
    }
  })
  return mixins
}
