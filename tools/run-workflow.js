#!/usr/bin/env node

import path from 'path'
import { executeWorkflow, loadInputFile } from './workflow-runner.js'

const workflowFile = process.argv[2]
const inputFile = process.argv[3]
if (!workflowFile) {
  console.error(
    '用法：node tools/run-workflow.js workflows/<workflow-file>.yaml [input.json]',
  )
  process.exit(1)
}

let inputOverride = {}
if (inputFile) {
  inputOverride = loadInputFile(inputFile)
  console.log(`加载输入文件：${inputFile}`)
}

const resolved = path.resolve(process.cwd(), workflowFile)

try {
  const result = await executeWorkflow(resolved, inputOverride)
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error('执行失败：', error.message)
  process.exit(1)
}
