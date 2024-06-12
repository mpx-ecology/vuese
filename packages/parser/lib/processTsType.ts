import * as bt from '@babel/types'
import { ParserOptions } from './index'
import Typedoc from 'typedoc'

type ProcessTsTypeReturnItem = {
  isOriginType: boolean
  originName: string,
  typeRes: string
}
export function processTsType(node: bt.TSAsExpression, options: ParserOptions, originSource: string): ProcessTsTypeReturnItem[]|undefined {
  if (!options.jsFilePath) return

  const jsFilePath = options.jsFilePath
  const typeInfo = findType(node, options, originSource)
  if (!typeInfo) return
 
  const typeName = typeInfo.type
  if (typeName.includes('|')) {
    const arr = typeName.split('|')
    let res: ProcessTsTypeReturnItem[] = []
    res = arr.map(item => {
      const isOriginType = originTypeJudge(item)
      const typeRes = typeNameHandler(item, jsFilePath)
      return {
        isOriginType,
        originName: item,
        typeRes: typeRes
      }
    })
    return res
  } else {
    const isOriginType = originTypeJudge(typeName)
    const finalType = typeNameHandler(typeName, jsFilePath)
    return [{
      isOriginType,
      originName: typeName,
      typeRes: finalType
    }]
  }
}

const typeNameMap = {}
function typeNameHandler(typeName: string, jsFilePath: string): string {
  let res
  const isOriginType = originTypeJudge(typeName)
  if (isOriginType) {
    res = typeName
  } else {
    if (typeNameMap[typeName]) return typeNameMap[typeName]

    const node = findNodeByTypeName(typeName, jsFilePath)
    res = TypedocNodeToString(node)
    typeNameMap[typeName] = res
  }
  return res
}

function originTypeJudge(typeName: string): boolean {
  return ['number', 'string', 'boolean'].includes(typeName)
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
  } else if (bt.isTSTypeReference(node.typeAnnotation)) {
    if (bt.isIdentifier(node.typeAnnotation.typeName)) {
      type = node.typeAnnotation.typeName.name
    }
  } else if (bt.isTSUnionType(node.typeAnnotation)) {
    type = originSource.slice(node.typeAnnotation.start || 0, node.typeAnnotation.end || 0)
  }
  return {
    type,
    isArray
  }
}

const TypedocJsonIds: {
  [key: string]: Typedoc.Models.DeclarationReflection
} = {}
function findNodeByTypeName(typeName, jsFilePath) {
  function getIdMap(arr?: Typedoc.Models.DeclarationReflection[]) {
    if (!arr?.length) return
    arr.forEach(item => {
      // Typedoc.Models.ReflectionKind
      if (item.kind !== 2) {
        TypedocJsonIds[item.id] = item
      }
      if (item.children) {
        getIdMap(item.children)
      }
    })
  }
  Object.keys(TypedocJsonIds).length || getIdMap(typedocProject.children)

  const sets: Typedoc.Models.DeclarationReflection[] = []
  for (const key in TypedocJsonIds) {
    if (TypedocJsonIds[key].name === typeName) sets.push(TypedocJsonIds[key])
  }
  if (sets.length === 1) return sets[0]
  if (sets.length > 1) {
    for (let i = 0; i < sets.length; i++) {
      const source = sets[i].sources
      if (source) {
        const filePath = source[0].fileName.replace(/(\.\.\/)n/, '')
        if (jsFilePath.includes(filePath)) return sets[i]  
      }
    }
  }
  return undefined
}
const TypedocReflectionKind = Typedoc.Models.ReflectionKind
const nodeVisitor = {
  [TypedocReflectionKind.TypeAlias](node: Typedoc.Models.DeclarationReflection) {
    return  TypedocTypeNodeVisit(node.type)
  },
  [TypedocReflectionKind.Interface](node: Typedoc.Models.DeclarationReflection) {
    if (!node.children) return ''
    let res = ''
    node.children.forEach(item => {
      res = `${res}<br>&nbsp;&nbsp;${nodeVisitor[item.kind](item)};`
    })
    res = `{${res}<br>}`
    return res
  },
  [TypedocReflectionKind.TypeLiteral](node: Typedoc.Models.DeclarationReflection) {
    return nodeVisitor[TypedocReflectionKind.Interface](node)
  },
  [TypedocReflectionKind.Property](node: Typedoc.Models.DeclarationReflection) {
    const key = node.flags.isOptional ? node.name + '?' : node.name
    const value = TypedocTypeNodeVisit(node.type)
    return `${key}: ${value}`
  }
}

const typeNodeVisitor = {
  array(node: Typedoc.ArrayType) {
    const elementTypeText = TypedocTypeNodeVisit(node.elementType)
    return elementTypeText + '[]'
  },
  reference(node: Typedoc.ReferenceType) {
    if (node.name === 'Partial') {
      if (!node.typeArguments) return ''
      const res = TypedocTypeNodeVisit(node.typeArguments[0])
      return `Partial<${res}>`
    }
    return TypedocNodeToString(node.reflection as unknown as Typedoc.Models.DeclarationReflection)
  },
  intrinsic(node: Typedoc.IntrinsicType) {
    return node.name
  },
  union(node: Typedoc.UnionType) {
    let res = ''
    node.types.forEach((type, index) => {
      res = res + TypedocTypeNodeVisit(type)
      if (index < node.types.length - 1) {
        res = res + '\\|'
      }
    })
    return res
  },
  intersection(node: Typedoc.IntersectionType) {
    let res = ''
    node.types.forEach((type, index) => {
      res = res + TypedocTypeNodeVisit(type)
      if (index < node.types.length - 1) {
        res = res + '&'
      }
    })
    return res
  },
  reflection(node: Typedoc.ReflectionType) {
    return TypedocNodeToString(node.declaration)
  },
  literal(node: Typedoc.LiteralType) {
    return node.value
  }
}
function TypedocNodeToString(node?: Typedoc.Models.DeclarationReflection) : string {
  if (!node) return ''
  if (node?.comment?.blockTags[0].tag === '@typedocFollow') {
    return node.comment.blockTags[0].content[0].text
  }
  if (nodeVisitor[node.kind]) {
    return nodeVisitor[node.kind](node)
  } else {
    console.log('出错啦，找不到对应kind')
    return ''
  }
}
function TypedocTypeNodeVisit(typeNode?: Typedoc.SomeType) {
  if (!typeNode) return ''
  if (typeNodeVisitor[typeNode?.type]) {
    return typeNodeVisitor[typeNode.type](typeNode)
  } else {
    console.log('出错啦，找不到对应type')
    return ''
  }
}

let typedocProject: Typedoc.Models.ProjectReflection
export function setTypedocProject(project?: Typedoc.Models.ProjectReflection) {
  if (typedocProject || !project) return
  typedocProject = project
}
export async function createTypedocProject(config) {
  const app = await Typedoc.Application.bootstrapWithPlugins({
    entryPoints: config.entryPoints,
    name: 'tt',
    skipErrorChecking: true,
    entryPointStrategy: 'expand',
    /**
     * 只能添加 被间接引用但没直接导出的
     * typedoc 把文件中的 export 的内容当作入口，未在入口中的内容，不会被查找
     */
    plugin: ['typedoc-plugin-missing-exports'],
    // eslint-disable-next-line
    // @ts-ignore
    internalModule: 'notExport', // typedoc-plugin-missing-exports 使用，设置目录名
    // excludeExternals: true, // 配合 typedoc-plugin-missing-exports 
    excludeNotDocumented: true,  // 移除没有添加注释的
    excludeNotDocumentedKinds: ['Variable', 'CallSignature']
  })
  app.options.addReader(new Typedoc.TSConfigReader())
  const project = await app.convert()
  return project
}