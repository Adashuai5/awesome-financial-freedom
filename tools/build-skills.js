import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const promptPath = path.resolve(__dirname, '../prompts/system-prompt.md')
const claudePath = path.resolve(__dirname, '../skills/claude-skill.md')
const chatgptPath = path.resolve(__dirname, '../skills/chatgpt-gpt.md')

function buildSkill(templateTitle, outputPath) {
  const prompt = fs.readFileSync(promptPath, 'utf-8')
  const content = `# ${templateTitle}\n\n## System Prompt\n\n${prompt}\n`
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`Generated ${outputPath}`)
}

buildSkill('Awesome Financial Freedom - Claude Skill', claudePath)
buildSkill('Awesome Financial Freedom Advisor - ChatGPT GPT', chatgptPath)
