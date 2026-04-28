/**
 * Build the claude-skill.md file from prompt templates.
 * Updated 2026-04-29: merged duplicate EN/ZH files, removed chatgpt-gpt target.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const systemPromptPath = path.resolve(__dirname, '../prompts/system.md')
const outputPath = path.resolve(__dirname, '../skills/claude-skill.md')

function build() {
  const systemMd = fs.readFileSync(systemPromptPath, 'utf-8')

  // The skill file is maintained manually in the repo.
  // This script regenerates the embedded system prompt section only.
  // For full Hermes skill, see ~/.hermes/skills/financial-freedom-advisor/SKILL.md

  const existing = fs.readFileSync(outputPath, 'utf-8')
  // Replace the System Prompt block between the markdown code fences
  const updated = existing.replace(
    /```\n[\s\S]*?```/,
    '```\n' + systemMd.trim() + '\n```'
  )
  fs.writeFileSync(outputPath, updated, 'utf-8')
  console.log(`Updated system prompt in ${outputPath}`)
}

build()
