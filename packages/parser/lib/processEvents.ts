import * as bt from '@babel/types'
import { NodePath } from '@babel/traverse'
import { EventResult } from './index'
import { getComments, CommentResult } from './jscomments'

/**
 *
 * @param eventName {string} The event name
 * @param cnode {bt.Node} Node with comments
 * @param result {EventResult}
 */
export function processEventName(
  eventName: string,
  cnodePath: NodePath<bt.Node>,
  result: EventResult
): void {
  const cnode = cnodePath.node
  const syncRE = /^update:(.+)/
  const eventNameMatchs = eventName.match(syncRE)
  // Mark as .sync
  if (eventNameMatchs) {
    result.isSync = true
    result.syncProp = eventNameMatchs[1]
  }

  let allComments: CommentResult = getComments(cnode)
  const prevPathKey = Number(cnodePath.key) - 1
  if (allComments.nameGroup) {
    const nameGroup = allComments.nameGroup
    const descGroup = allComments.descGroup || allComments.default
    const argGroup = allComments.argGroup || allComments.arg
    const versionGroup = allComments.versionGroup || allComments.version
    result.arr = nameGroupHandler(nameGroup, descGroup, argGroup, versionGroup)
  } else if (!allComments.default.length && prevPathKey >= 0) {
    // Use the trailing comments of the prev node
    allComments = getComments(cnodePath.getSibling(prevPathKey).node, true)
    result.describe = allComments.default
    result.argumentsDesc = allComments.arg
    result.version = allComments.version
  } else {
    result.describe = allComments.default
    result.argumentsDesc = allComments.arg
    result.version = allComments.version
  }

  
}

function nameGroupHandler(
  nameGroup: string[],
  descGroup: string[],
  argGroup: string[],
  versionGroup: string[]
) {  
  const reg = /^\[(.*?)\](.*)/
  const names = nameGroup[0].match(reg)![1].replaceAll(' ', '').split(',')
  const map: {
    [key: string]: EventResult
  } = {}
  names.forEach(name => {
    map[name] = {
      isSync: false,
      syncProp: '',
      name,
      describe: [],
      argumentsDesc: [],
      version: []
    }
    descGroup?.forEach(desc => {
      const matchRes = desc.match(reg)
      if (!matchRes) {
        (map[name].describe as string[]).push(desc)
      } else if (matchRes[1] && matchRes[2]) {
        if (matchRes[1].replaceAll(' ', '').split(',').filter(Boolean).includes(name)) {
          (map[name].describe as string[]).push(matchRes[2].trim())
        }
      }
    })

    argGroup?.forEach(desc => {
      const matchRes = desc.match(reg)
      if (!matchRes) {
        map[name].argumentsDesc!.push(desc)
      } else if (matchRes[1] && matchRes[2]) {
        if (matchRes[1].replaceAll(' ', '').split(',').filter(Boolean).includes(name)) {
          map[name].argumentsDesc!.push(matchRes[2].trim())
        }
      }
    })


    versionGroup?.forEach(desc => {
      const matchRes = desc.match(reg)
      if (!matchRes) {
        map[name].version!.push(desc)
      } else if (matchRes[1] && matchRes[2]) {
        if (matchRes[1].replaceAll(' ', '').split(',').filter(Boolean).includes(name)) {
          map[name].version!.push(matchRes[2].trim())
        }
      }
    })
  })
  return Object.keys(map).map(key => {
    return map[key]
  })
}

export function getEmitDecorator(
  decorators: bt.Decorator[] | null
): bt.Decorator | null {
  if (!decorators || !decorators.length) return null
  for (let i = 0; i < decorators.length; i++) {
    const exp = decorators[i].expression
    if (
      bt.isCallExpression(exp) &&
      bt.isIdentifier(exp.callee) &&
      exp.callee.name === 'Emit'
    ) {
      return decorators[i]
    }
  }
  return null
}
