import * as bt from '@babel/types'
import * as ts from 'typescript'
import { ParserOptions } from './index'

export function processTsType(node: bt.TSAsExpression, options: ParserOptions, originSource: string): string {
  if (!options.jsFilePath) return ''
  const typeInfo = findType(node, options, originSource)
  if (!typeInfo) return ''
  const typeName = typeInfo.type
  setProgram(options.jsFilePath)
  const typeNameNode = findTypeNameNode(typeName)
  if (!typeNameNode) {
    clearProgram()
    return ''
  }
  const res = findTypeValue(typeNameNode)
  if (typeInfo.isArray) return res + '[]'
  else return res
}

let program: ts.Program|undefined
let checker: ts.TypeChecker
let source: ts.SourceFile|undefined
function setProgram(path: string): void {
  program = ts.createProgram([path], {})
  checker = program.getTypeChecker()
  source = program.getSourceFile(path)
}

function clearProgram(): void {
  program = undefined
  source = undefined
  checker = undefined as unknown as ts.TypeChecker
}

function findType(node: bt.TSAsExpression, options: ParserOptions, originSource: string): {
  type: string
  isArray: boolean
 }|undefined {
  if (!options.jsFilePath) return
  let type = ''
  let isArray = false
  if (bt.isTSArrayType(node.typeAnnotation)) {
    const element = node.typeAnnotation.elementType
    type = originSource.slice(element.start || 0, element.end || 0)
    isArray = true
  } else if (bt.isTSInterfaceBody(node.typeAnnotation)) {
    // 待定
  }
  return {
    type,
    isArray
  }
}

function findTypeNameNode(typeName: string): ts.ImportSpecifier|undefined {
  if (!source) return
  let targetNode
  ts.forEachChild(source, (node) => {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause
      if (!importClause) return
      const namedBindings = importClause.namedBindings
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

function findTypeValue(typeNode: ts.ImportSpecifier): string {
  if (ts.isImportSpecifier(typeNode)) {
    return ImportSpecifierHandler(typeNode)
  } else {
    return ''
  }
}

function ImportSpecifierHandler(node: ts.ImportSpecifier): string {
  if (!checker) return ''
  const symbol = checker.getSymbolAtLocation(node.name)
  if (!symbol) return ''
  const aliasSymbol = checker.getAliasedSymbol(symbol)
  if (aliasSymbol.flags === ts.SymbolFlags.TypeAlias) {
    return typeNodeHandler((aliasSymbol.declarations![0] as ts.TypeAliasDeclaration).type)
  } else if (aliasSymbol.flags === ts.SymbolFlags.Interface) {
    // interface A
  }
  return ''
}

function typeNodeHandler(node: ts.TypeNode): string {
  if (ts.isArrayTypeNode(node)) {
    // export type A = xx[]
    return arrayTypeHandler(node)
  } else if (ts.isUnionTypeNode(node)) {
    return unionTypeHandler(node)
  } else if (ts.isTypeReferenceNode(node)) {
    return typeReferenceNodeHandler(node)
  } else if (ts.isToken(node)) {
    return tokenNodeHandler(node)
  } else {
    return ''
  }
}

function arrayTypeHandler(node: ts.ArrayTypeNode): string {
  let res = '[]'
  res = typeNodeHandler(node.elementType) + res
  return res
}

function unionTypeHandler(node: ts.UnionTypeNode): string {
  const res: string[] = []
  node.types.forEach(type => {
    res.push(typeNodeHandler(type))
  })
  return res.join('|')
}

function typeReferenceNodeHandler(node: ts.TypeReferenceNode): string {
  const type = checker.getTypeAtLocation(node)
  const properties = type.getProperties()
  const res: string[] = []
  properties.forEach(property => {
    const name = checker.symbolToString(property)
    let value = ''
    if (ts.isPropertySignature(property.valueDeclaration)) {
      const typeNode = property.valueDeclaration.type
      value = typeNode ? typeNodeHandler(typeNode) : 'unknow'
    }
    res.push(name + ': ' + value)
  })
  return '{' + res.join(', ') + '}'
  // const type = checker.getTypeAtLocation(node.elementType)
  // if (type.flags === ts.TypeFlags.Object) {
  //   const properties = type.getProperties()
  //   properties.forEach(property => {
  //     if (ts.isPropertySignature(property.valueDeclaration)) {
  //       const typeNode = property.valueDeclaration.type
  //       typeNode && typeNodeHandler(typeNode)
  //     }
  //   })
  // }
}

function tokenNodeHandler(node): string {
  const printer = ts.createPrinter()
  return printer.printNode(4, node, node.getSourceFile())
}
