# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> An AI-native financial freedom execution system, not just a knowledge list.
> A beginner asks AI: I earn $5,000/month and save $1,000. When can I retire? AI gives the answer.

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/ada/awesome-financial-freedom/discussions)

**Last updated**: see [`git log --reverse --format="%ad" | head -1`](https://github.com/ada/awesome-financial-freedom/commits?author=ada) for the earliest commit date

![Demo: AI answers retirement and rebalancing](assets/hero-demo.svg)

## 🧭 Quick Navigation

- **Demo**: [`https://adashuai5.github.io/awesome-financial-freedom/demo/`](https://adashuai5.github.io/awesome-financial-freedom/demo/) (live, no install)
- **Playbooks** (guides + tutorials): [`playbooks/guides/`](playbooks/guides)
- **Knowledge nodes**: [`knowledge/nodes/`](knowledge/nodes)
- **Workflows**: [`workflows/`](workflows)
- **Prompts & Agents**: [`prompts/`](prompts) · [`agents/`](agents)
- **Skills & Tools**: [`skills/`](skills) · [`tools/`](tools)
- **Book summaries**: [`playbooks/book-summaries/`](playbooks/book-summaries)

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

This is a user-facing financial freedom planning tool. Enter your current savings, annual income, annual expenses, annual savings, expected return, safe withdrawal rate, and asset allocation, and the system will return:

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

## 🚀 How to Use

### 1️⃣ Try the demo (no install needed)

Open **`https://adashuai5.github.io/awesome-financial-freedom/demo/`** and enter your numbers. You'll get:

- **FIRE target** and estimated years to financial independence
- Key action recommendations
- Portfolio rebalancing guidance

### 2️⃣ Prepare your numbers

Before opening the demo, gather: current savings, annual income, annual expenses, expected return, safe withdrawal rate, and asset mix (e.g. 60% stocks / 40% bonds).

### 3️⃣ Explore deeper

Once you have a result, dive into the system:

| If you want to… | Go to |
|----------------|-------|
| Run locally + AI assistant | [`playbooks/tutorials/getting-started.md`](playbooks/tutorials/getting-started.md) |
| Understand the system design | [`playbooks/guides/money-os-architecture.md`](playbooks/guides/money-os-architecture.md) |
| Execute via CLI | `node tools/run-workflow.js workflows/fire_planning.yaml` (Node.js ≥18) |
| Browse all workflows | [`workflows/`](workflows) |

## 📖 Knowledge Structure

Seven progressive stages from mindset to financial independence:

| Stage | Directory | What you'll learn |
|-------|-----------|-------------------|
| 01 — Mindset | [`knowledge/nodes/01-mindset/`](knowledge/nodes/01-mindset) | What financial freedom really means; money as a tool, not a goal |
| 02 — Foundation | [`knowledge/nodes/02-foundation/`](knowledge/nodes/02-foundation) | Emergency funds, insurance, eliminating high-interest debt |
| 03 — Accumulation | [`knowledge/nodes/03-accumulation/`](knowledge/nodes/03-accumulation) | Increase savings rate; side income; compound growth basics |
| 04 — Allocation | [`knowledge/nodes/04-allocation/`](knowledge/nodes/04-allocation) | Asset allocation, Diversification, index funds, rebalancing |
| 05 — Automation | [`knowledge/nodes/05-automation/`](knowledge/nodes/05-automation) | Automate savings and investments so discipline becomes automatic |
| 06 — Freedom | [`knowledge/nodes/06-freedom/`](knowledge/nodes/06-freedom) | FIRE math, safe withdrawal rate, coast FIRE, barista FIRE |
| 07 — Learning Path | [`knowledge/nodes/07-learning-path/`](knowledge/nodes/07-learning-path) | Stage-based roadmap; which node to read next |

## 🤝 Contributing

Contributions welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for:
- How to report issues or suggest new knowledge nodes
- Pull request workflow and coding style
- How to add prompts, workflows, or playbook content

## 📄 License

- **Knowledge Content**: Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) - see the [LICENSE](LICENSE) file for details.
- **Code and Tools**: Licensed under MIT - see the [LICENSE-CODE.md](LICENSE-CODE.md) file for details.
