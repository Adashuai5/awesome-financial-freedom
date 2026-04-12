#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

function simulateStep(step, state) {
  console.log(`\n执行步骤：${step.id} - ${step.name}`)
  console.log(`类型：${step.type}`)

  switch (step.type) {
    case 'prompt':
      console.log(`使用模板：${step.prompt_id}`)
      state.output = state.output || {}
      state.output[step.id] = { simulated: `Prompt ${step.prompt_id} executed` }
      break
    case 'calculator':
      console.log(`调用计算器：${step.calculator_id}`)
      state.output = state.output || {}
      state.output[step.id] = {
        simulated: `Calculator ${step.calculator_id} result`,
      }
      break
    case 'api_call':
      console.log('模拟 API 调用')
      state.output = state.output || {}
      state.output[step.id] = { simulated: 'API call result' }
      break
    case 'condition':
      console.log('模拟条件判断')
      state.output = state.output || {}
      state.output[step.id] = { simulated: 'Condition evaluated' }
      break
    default:
      console.warn(`未知步骤类型：${step.type}`)
  }

  state.last_step = step.id
  return state
}

function runWorkflow(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const workflow = yaml.load(content)

  if (typeof workflow !== 'object' || workflow === null) {
    throw new Error('工作流文件未解析为对象，请检查 YAML 语法。')
  }

  if (!Array.isArray(workflow.steps)) {
    throw new Error('工作流文件必须包含 steps 数组。')
  }

  console.log(`\n加载工作流：${workflow.name || path.basename(filePath)}`)
  console.log(`描述：${workflow.description || '（无描述）'}`)

  const steps = workflow.steps || []
  const state = { output: {}, input: workflow.input || {} }

  for (const step of steps) {
    try {
      simulateStep(step, state)
    } catch (error) {
      console.error(`步骤失败：${step.id} - ${error.message}`)
      if (step.on_error === 'abort') {
        console.error('流程终止')
        break
      }
    }
  }

  console.log('\n工作流执行模拟完成。输出示例：')
  console.log(JSON.stringify(state.output, null, 2))
}

const workflowFile = process.argv[2]
if (!workflowFile) {
  console.error(
    '用法：node tools/run-workflow.js workflows/<workflow-file>.yaml',
  )
  process.exit(1)
}

const resolved = path.resolve(process.cwd(), workflowFile)
runWorkflow(resolved)
