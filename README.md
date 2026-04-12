# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> An awesome list of structured knowledge about financial independence, packaged as an AI Skill for effortless conversational learning.

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/ada/awesome-financial-freedom/discussions)

**Last updated: 2026-04-14**

## 🧭 Project Navigation

- **Playbooks**: [`playbooks/`](playbooks)
- **Workflows**: [`workflows/`](workflows)
- **Prompts**: [`prompts/`](prompts)
- **Agents**: [`agents/`](agents)
- **Data**: [`data/`](data)
- **Docs portal**: [`docs/README.md`](docs/README.md)
- **Getting started**: [`playbooks/tutorials/getting-started.md`](playbooks/tutorials/getting-started.md)
- **Book summaries**: [`playbooks/book-summaries`](playbooks/book-summaries)
- **Knowledge nodes**: [`knowledge/nodes/`](knowledge/nodes)
- **Skills**: [`skills/`](skills)
- **Tools**: [`tools/`](tools)
- **Contributing**: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## 🤔 What is this?

**Awesome Financial Freedom** is an open-source, AI-native knowledge base for financial freedom. It combines the structured curation of awesome lists with AI Skill conversational capabilities, enabling "effortless" learning.

Instead of just a static list of links, this repo provides:

- 📚 **Structured JSON knowledge nodes** covering mindset, saving, investing, and FIRE principles.
- 🤖 **Ready-to-use AI Skills** for Claude and ChatGPT, so you can ask questions like:
  - _"I earn $5,000/month and save $1,000. When can I retire?"_
  - _"Review my portfolio: 70% S&P 500, 30% bonds."_
  - _"What's the 'Dual-Wheel Asset Allocation' method?"_
- 🧮 **Embedded calculators** and formulas for transparent, step-by-step answers.
- 📍 **Learning path guide** for stage-based progression and personalized financial goals.
- ✅ **Actionable steps guide** for quick wins and risk-aware first moves, see [`docs/actionable-steps.md`](docs/actionable-steps.md).

**Zero setup. Just chat.**

### 🎯 Target Audience

- Financial beginners (理财小白)
- FIRE explorers
- Ordinary people seeking a healthy relationship with money

## ✨ Why This Exists

The internet is full of personal finance blogs, paid courses, and scattered advice. But there is **no open-source, structured, AI-ready knowledge base** dedicated to financial freedom.

This project fills that gap by providing a **community-driven, transparent, and conversational** learning path. Its core innovation lies in combining the structured curation of awesome lists with AI Skill conversational capabilities, enabling "effortless" learning.

## 📚 Knowledge Sources

Curated insights from:

- Tony Robbins' _Money: Master the Game_ trilogy ([Amazon](https://www.amazon.com/Money-Master-Game-7-Simple/dp/1476757801))
- JL Collins' _The Simple Path to Wealth_ ([Amazon](https://www.amazon.com/Simple-Path-Wealth-financial-independence/dp/1533667926))
- FIRE mathematics (4% rule, Trinity Study) ([Wikipedia](https://en.wikipedia.org/wiki/Trinity_study))
- 阿秋's _让钱去工作_ (Dual-Wheel Asset Allocation) ([JD.com](https://item.jd.com/100240963394.html) or search for "让钱去工作 阿秋")
- And more (see `/docs/book-summaries`)

## 🚀 How to Use (The "No-Brainer" Way)

### 1️⃣ Talk to the AI (Easiest)

- Add the **Awesome Financial Freedom Skill** to your Claude or ChatGPT.
- Start asking questions. The AI will retrieve relevant knowledge nodes and perform calculations for you.

### 2️⃣ Browse the Knowledge Base

Clone this repo and explore the `/knowledge/nodes` directory. Each `.json` file contains:

- `question_patterns` (what the AI listens for)
- `answer` with summary, formula, example, and limitations
- `action_item` (a concrete next step for you)
- `source` citations

### 3️⃣ AI-Executable Workflows

The new `workflows/` directory contains executable workflow definitions that agents can run directly. Each workflow is paired with prompt templates in `prompts/` and can be simulated using `tools/run-workflow.js`.

Use these workflows to automate:

- AI 内容生产与增长策略
- 联盟营销 SEO 自动化
- 指数基金定投模拟与教育计划

### 4️⃣ Build Your Own Tool

Use the structured data and calculators (`/tools`) to integrate financial freedom logic into your own apps.

## 📖 Knowledge Structure

- 01-mindset/ — 心态与价值观
- 02-foundation/ — 基础财务健康
- 03-accumulation/ — 储蓄与收入增长
- 04-allocation/ — 资产配置与投资
- 05-automation/ — 自动化储蓄与投资
- 06-freedom/ — FIRE 目标与提款策略
- 07-learning-path/ — 路径规划与阶段性行动建议

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

- **Knowledge Content**: Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) - see the [LICENSE](LICENSE) file for details.
- **Code and Tools**: Licensed under MIT - see the [LICENSE-CODE.md](LICENSE-CODE.md) file for details.
