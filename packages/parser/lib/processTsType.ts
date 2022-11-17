import * as bt from '@babel/types'
import * as ts from 'typescript'
import { ParserOptions } from './index'

export function processTsType(node: bt.TSAsExpression, options: ParserOptions, originSource: string): void {
  if (!options.jsFilePath) return
  const typeName = findTypeName(node, options, originSource)
  if (!typeName) return

  setProgram(options.jsFilePath)
  const typeNameNode = findTypeNameNode(typeName)
  if (!typeNameNode) {
    clearProgram()
    return
  }

  findTypeValue(typeNameNode)
}

let program: ts.Program|undefined
let source: ts.SourceFile|undefined
let checker: ts.TypeChecker|undefined
function setProgram(path: string): void {
  program = ts.createProgram([path], {})
  source = program.getSourceFile(path)
  checker = program.getTypeChecker()
}

function clearProgram(): void {
  program = undefined
  source = undefined
  checker = undefined
}

function findTypeName(node: bt.TSAsExpression, options: ParserOptions, originSource: string) {
  if (!options.jsFilePath) return
  let typeName = ''
  if (bt.isTSArrayType(node.typeAnnotation)) {
    const element = node.typeAnnotation.elementType
    typeName = originSource.slice(element.start || 0, element.end || 0)
  } else if (bt.isTSInterfaceBody(node.typeAnnotation)) {
    // 待定
  }
  return typeName
}

function findTypeNameNode(typeName: string): ts.ImportSpecifier|undefined {
  let targetNode
  ts.forEachChild(source!, (node) => {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause
      const namedBindings = importClause!.namedBindings
      if(namedBindings && ts.isNamedImports(namedBindings)) {
        // import name
        const elements = namedBindings.elements
        for (let i = 0; i < elements.length; i++) {
          const name = ts.idText(elements[i].name)
          if (name === typeName) {
            targetNode = elements[i]
            return elements[i]
          }
        }
      } else {
        // import default
      }
    }
  })
  if (targetNode) {
    return targetNode
  }
}

function findTypeValue(typeNode: ts.ImportSpecifier) {
  if (ts.isImportSpecifier(typeNode)) {
    ImportSpecifierHandler(typeNode)
  }
}

function ImportSpecifierHandler(node: ts.ImportSpecifier) {
  if (!checker) return
  const symbol = checker.getSymbolAtLocation(node.name)
  if (!symbol) return
  const aliasSymbol = checker.getAliasedSymbol(symbol)
  if (aliasSymbol.flags === ts.SymbolFlags.TypeAlias) {
    // type A
    typeAliasDeclarationHandler(aliasSymbol.declarations![0] as ts.TypeAliasDeclaration)
  } else if (aliasSymbol.flags === ts.SymbolFlags.Interface) {
    // interface A
  }
}

function typeAliasDeclarationHandler(node: ts.TypeAliasDeclaration) {
  console.log(node)
}