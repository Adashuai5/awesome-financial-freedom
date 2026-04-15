import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { executeWorkflow } from '../tools/workflow-runner.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 4000

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function formatSummary(workflow, output) {
  if (workflow === 'fire_planning') {
    const planSummary = output.review_plan?.planSummary
    const goalData = output.calculate_goal
    const summary = planSummary || goalData || {}
    const targetAssets =
      summary.targetAssets || (goalData && goalData.targetAssets) || 'N/A'
    const yearsToFI =
      summary.yearsToFI || (goalData && goalData.yearsToFI) || 'N/A'
    const actions = planSummary?.keyActions || []

    return {
      quick: `目标资产 ${targetAssets} 元，预计 ${yearsToFI} 年达到 FIRE。`,
      actions,
      raw: output,
    }
  }

  if (workflow === 'portfolio_rebalancing') {
    const tradePlan = output.rebalancing_plan?.tradePlan || []
    const notes = output.rebalancing_plan?.riskNote || ''
    return {
      quick: tradePlan.length
        ? `建议执行 ${tradePlan.length} 个再平衡操作。`
        : '当前组合接近目标比例，无需立即再平衡。',
      actions: tradePlan,
      notes,
      raw: output,
    }
  }

  return { quick: '暂无摘要', raw: output }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    return serveFile(
      res,
      path.join(__dirname, 'index.html'),
      'text/html; charset=utf-8',
    )
  }

  if (req.method === 'GET' && req.url === '/style.css') {
    return serveFile(
      res,
      path.join(__dirname, 'style.css'),
      'text/css; charset=utf-8',
    )
  }

  if (req.method === 'POST' && req.url === '/api/run') {
    try {
      const body = await parseBody(req)
      const workflow = body.workflow
      const input = body.input || {}
      if (!workflow) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'workflow is required' }))
        return
      }
      const workflowFile = path.resolve(
        process.cwd(),
        'workflows',
        `${workflow}.yaml`,
      )
      const result = await executeWorkflow(workflowFile, input)
      const summary = formatSummary(workflow, result.output)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ workflow: result.workflow, summary, result }, null, 2),
      )
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`)
})
