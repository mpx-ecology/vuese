import { parse as babelParse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import { resolve as pathResolve } from 'path'
import * as bt from '@babel/types'
import * as fs from 'fs'

export function findImportDeclaration(filePath, name) {
  filePath = normalizePath(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babelParse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  })
  return traverseAst(ast, name, filePath)
}

function traverseAst(ast, name, filePath) {
  const variableResult = {}
  let exportedResult = {}
  traverse(ast, {
    // let a = xxx
    VariableDeclaration(rootPath: NodePath<bt.VariableDeclaration>) {
      rootPath.node.declarations.forEach(declaration => {
        const { id, init } = declaration
        variableResult[(id as any).name] = init
      })
    },
    // a = xxx
    AssignmentExpression(rootPath: NodePath<bt.AssignmentExpression>) {
      const node = rootPath.node as any
      variableResult[node.left.name] = node.right
    },
    // export a from 'xxx'
    ExportNamedDeclaration(rootPath: NodePath<bt.ExportNamedDeclaration>) {
      const node = rootPath.node
      if (node.source) {
        const specifiers = node.specifiers
        for (let i = 0; i < specifiers.length; i++) {
          if (specifiers[i].exported.name === name) {
            exportedResult = {
              type: 'exportFrom',
              originName: (specifiers[i] as bt.ExportSpecifier).local.name,
              from: node.source.value
            }
            break
          }
        }
      } else if (node.declaration) {
        const declarations = (node.declaration as bt.VariableDeclaration ).declarations
        for (let i = 0; i < declarations.length; i++) {
          if ((declarations[i].id as bt.Identifier).name === name) {
            exportedResult = {
              type: 'exportVariable'
            }
            break
          }
        }
      }
    }
  })

  if (exportedResult.type === 'exportFrom') {
    filePath = pathResolve(filePath.slice(0, filePath.lastIndexOf('/')), exportedResult.from)
    filePath = normalizePath(filePath)

    if (exportedResult.originName === 'default') {
      return findDefaultImportDeclaration(filePath)
    }
  } else if (exportedResult.type === 'exportVariable') {
    return variableResult[name]
  }

  return ast
}

function findDefaultImportDeclaration(filePath) {
  filePath = normalizePath(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babelParse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  })
  return ast
}

function normalizePath(filePath) {
  if (/index$/.test(filePath)) {
    filePath = filePath.slice(0, filePath.length - 6)
  }

  if (!fs.existsSync(filePath)) {
    const _filePath = filePath + '.ts'
    filePath = fs.existsSync(_filePath) ? _filePath : (filePath + '.js')
  }

  if (fs.statSync(filePath).isDirectory()) {
    let _filePath = filePath + '/index.ts'
    if (!fs.existsSync(_filePath)) {
      _filePath = filePath +'/index.js'
    }
    filePath = _filePath
  }
  return filePath
}