import fs from 'fs'

/**
 * 删除 script json
 * 
 * @param content 
 * @returns 
 */
export function delScriptJsonBlock(content: string) {
  const jsonBlockReg = /<script\s[\w\s]*(name=["']json["']|type=["']application\/json["'])(\s|[\w\s])*>[\s\S]*<\/script>/
  return content.replace(jsonBlockReg, '')
}


/**
 * 删除 content 中的空内容行
 * 
 * @param content 
 * @returns 
 */
export function delEmptyContentLineBreaks(content: string) {
  const scriptContentReg = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/ig
  const regResult = content.match(scriptContentReg)
  if (!regResult) return content
  const scriptContent = regResult[0]
  const isEmpty = scriptContent && scriptContent.replace('\n', '').length === 0
  if (isEmpty) {
    return content.replace(scriptContentReg, '')
  }
  return content
}

/**
 * 读取文件
 * 
 * @param {*} path
 * @return {*}
 */
export function readFileSync(path: string) {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf-8')
  }
  return ''
}

/**
 * 是否为mpx文件
 *
 * @param {*} file
 */
export function isMpxFile(file: string) {
  return file && file.match(/\.mpx/)
}


/**
 * 从示例文件夹获取获取mpx示例文件
 *
 * @param {string} exampleDir
 */
export function getExamplesMpxFiles(exampleDir: string) {
  return fs
    .readdirSync(exampleDir)
    .filter((dir) => isMpxFile(dir))
}
