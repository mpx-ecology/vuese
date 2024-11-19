#!/usr/bin/env node

const path = require('path')
const { removeSync, copySync, pathExistsSync } = require('fs-extra')
const { default: inquirer } = require('inquirer')

const dirname = 'docs'
const cwd = process.cwd()
const docsPath = path.resolve(cwd, dirname)
const templatePath = path.resolve(__dirname, '../template/docs')

function genDocs(overwrite = false) {
  if (overwrite) {
    removeSync(docsPath)
  }
  copySync(templatePath, docsPath)
}

async function init() {
  const docsPathExists = pathExistsSync(docsPath)
  if (docsPathExists) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: `当前目录下已经存在${dirname}文件夹，是否覆盖？`,
        default: true
      },
    ])
    if (answers.continue) {
      genDocs(true)
    }
  } else {
    genDocs()
  }
}

init()
