# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> An AI-native financial freedom execution system, not just a knowledge list.
> A beginner asks AI: I earn $5,000/month and save $1,000. When can I retire? AI gives the answer.

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/ada/awesome-financial-freedom/discussions)

**Last updated: 2026-04-25**

![Demo: AI answers retirement and rebalancing](assets/hero-demo.svg)

## 🧭 Project Navigation

- **Playbooks**: [`playbooks/`](playbooks)
- **Workflows**: [`workflows/`](workflows)
- **Prompts**: [`prompts/`](prompts)
- **Agents**: [`agents/`](agents)
- **Playbook guides**: [`playbooks/guides/README.md`](playbooks/guides/README.md)
- **Architecture**: [`playbooks/guides/money-os-architecture.md`](playbooks/guides/money-os-architecture.md)
- **Getting started**: [`playbooks/tutorials/getting-started.md`](playbooks/tutorials/getting-started.md)
- **Book summaries**: [`playbooks/book-summaries`](playbooks/book-summaries)
- **Knowledge nodes**: [`knowledge/nodes/`](knowledge/nodes)
- **Skills**: [`skills/`](skills)
- **Tools**: [`tools/`](tools)
- **Contributing**: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## 🤔 What is this?

**Awesome Financial Freedom** is an open-source, AI-native knowledge base for financial freedom. It combines the structured curation of awesome lists with AI Skill conversational capabilities, enabling *effortless* learning.

Instead of just a static list of links, this repo provides:

- 📚 **Structured JSON knowledge nodes** covering mindset, saving, investing, and FIRE principles.
- 🤖 **Ready-to-use AI Skills** for Claude and ChatGPT, so you can ask questions like:
  - _"I earn $5,000/month and save $1,000. When can I retire?"_
  - _"Review my portfolio: 70% S&P 500, 30% bonds."_
  - _"What's the 'Dual-Wheel Asset Allocation' method?"_
- 🧮 **Embedded calculators** and formulas for transparent, step-by-step answers.
- 📍 **Learning path guide** for stage-based progression and personalized financial goals.
- ✅ **Actionable steps guide** for quick wins and risk-aware first moves, see [`playbooks/guides/actionable-steps.md`](playbooks/guides/actionable-steps.md).

**No installation needed; the demo works in your browser.**

This is a user-facing financial freedom planning tool. Enter your current savings, annual expenses, annual savings, and asset allocation, and the system will return:

- FIRE target
- Estimated years to FIRE
- Key action recommendations
- Portfolio rebalancing guidance

## 🎯 Target audience

- People who want a direct path to financial freedom and actionable steps
- Young professionals who want to save but do not know where to start
- People who have heard of FIRE but do not know how it is calculated
- People who want AI to help plan their finances
- People who want to turn financial strategy into practical action

## ✨ Why This Exists

The internet is full of personal finance blogs, paid courses, and scattered advice. But there is **no open-source, structured, AI-ready financial freedom execution system** dedicated to helping people turn plans into action.

This project fills that gap by providing a **community-driven, transparent, and executable AI planning system**. Its core innovation lies in combining structured workflows, prompt templates, and calculator logic into a usable execution engine.

## 📚 Knowledge Sources

Curated insights from:

- Tony Robbins' _Money: Master the Game_ trilogy ([Amazon](https://www.amazon.com/Money-Master-Game-7-Simple/dp/1476757801))
- JL Collins' _The Simple Path to Wealth_ ([Amazon](https://www.amazon.com/Simple-Path-Wealth-financial-independence/dp/1533667926))
- FIRE mathematics (4% rule, Trinity Study) ([Wikipedia](https://en.wikipedia.org/wiki/Trinity_study))
- A Qiu's _Let Money Work_ (Dual-Wheel Asset Allocation)
- Additional sources in [`playbooks/book-summaries/`](playbooks/book-summaries/)

## 🚀 How to Use (The "No-Brainer" Way)

### 0️⃣ What you will get

This project is meant to give you a real financial plan, not just a document:

- A FIRE target and an estimated time to financial independence.
- A concise action plan for savings, investing, and risk management.
- Portfolio alignment guidance with buy/sell suggestions and risk notes.

These outputs are the actual value: a structured plan and clear next steps.

### 1️⃣ What to prepare

These are the numbers you will enter in the demo page:

- Current savings
- Annual income
- Annual expenses
- Annual savings
- Expected return
- Safe withdrawal rate
- Asset mix (for example, 60% stocks, 40% bonds)

### 2️⃣ What you will see

The system maps each input to a concrete output:

| Your input | System output |
|---|---|
| Current savings + Annual income + Annual expenses + Annual savings | **FIRE target** & **Estimated years to FIRE** |
| Expected return, Safe withdrawal rate | FIRE calculation parameters (compound growth, withdrawal math) |
| Asset mix (e.g. 60% stocks / 40% bonds) | **Rebalancing suggestions** and risk notes |

The result is a clear, readable plan summary:
- FIRE target
- Estimated years to FIRE
- Key action recommendations
- Rebalancing suggestions and risk notes

### 3️⃣ Try it now

Open the live demo and enter your numbers:

**`https://adashuai5.github.io/awesome-financial-freedom/`**

See FIRE targets, estimated years, action recommendations, and portfolio rebalancing guidance — no install needed.

### 4️⃣ When to explore more

If you want to learn more about how the system works, you can explore:

- [Getting started guide](playbooks/tutorials/getting-started.md) — run the calculator and AI assistant locally
- [Architecture overview](playbooks/guides/money-os-architecture.md) — system design and data flow
- [CLI workflow runner](tools/run-workflow.js) — `node tools/run-workflow.js workflows/fire_planning.yaml` (requires Node.js ≥18)
- Individual [workflow files](workflows/) — YAML definitions for FIRE planning, rebalancing, DCA, etc.

These are best explored after you have seen one result.

## 📖 Knowledge Structure

- 01-mindset/ — Mindset and values
- 02-foundation/ — Core financial health
- 03-accumulation/ — Savings and income growth
- 04-allocation/ — Asset allocation and investing
- 05-automation/ — Automated saving and investing
- 06-freedom/ — FIRE goals and withdrawal strategy
- 07-learning-path/ — Path planning and stage-based action guidance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

- **Knowledge Content**: Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) - see the [LICENSE](LICENSE) file for details.
- **Code and Tools**: Licensed under MIT - see the [LICENSE-CODE.md](LICENSE-CODE.md) file for details.
