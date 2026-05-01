# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> Answer 5 questions → know your FIRE stage → get a stage-specific tool → track monthly progress → send to AI for deep analysis.
> Built for beginners who don't know where to start, not just developers who can read JSON.

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/adashuai5/awesome-financial-freedom/discussions)

**Created**: 2026-04-12 · **Last updated**: 2026-04-26

![Stage diagnosis → 6 tools → monthly tracking → AI analysis](assets/hero-demo.svg)

## 🧭 Quick Navigation

- **Demo**: [`https://adashuai5.github.io/awesome-financial-freedom/demo/`](https://adashuai5.github.io/awesome-financial-freedom/demo/) (live, no install)
- **Playbooks** (guides + tutorials): [`playbooks/guides/`](playbooks/guides)
- **Knowledge nodes**: [`knowledge/nodes/`](knowledge/nodes)
- **Workflows**: [`workflows/`](workflows)
- **Prompts & Agents**: [`prompts/`](prompts) · [`agents/`](agents)
- **Skills & Tools**: [`skills/`](skills) · [`tools/`](tools)
- **Book summaries**: [`playbooks/book-summaries/`](playbooks/book-summaries)

## 🤔 What is this?

**Awesome Financial Freedom** is an open-source, AI-native FIRE planning system for Chinese investors. It combines structured knowledge, deterministic calculators, and a stage-based UX so a financial beginner knows exactly what to do today — not just what the math says in 20 years.

Core components:

- 🎯 **5-question stage diagnosis** — detects your current FIRE stage (debt phase → emergency fund → investing → accelerating → optimizing → sprinting) in under 30 seconds
- 🛠️ **6 stage-specific tools** — debt avalanche/snowball calculator, emergency fund progress bar, DCA simulator, savings-rate sensitivity table, rebalancing checklist, Coast FIRE calculator
- 📊 **Extended FIRE calculator** — income growth simulation, side-income scenarios, retirement lifestyle comparison (city / smaller city / Southeast Asia arbitrage / minimal), Coast FIRE check
- 🏦 **China-specific** — 个人养老金 (¥12,000/yr tax deduction), ETF codes (510300/159919 沪深300, 513500 QDII, 518880 黄金ETF), 公积金 handling
- 💾 **Monthly snapshot tracking** — localStorage snapshots, sparkline chart, trend arrows, no backend needed
- 🧠 **28 JSON knowledge nodes** — visible in-UI knowledge card, structured for accurate AI consumption
- 🤖 **One-click AI report** — structured 8-section prompt for Claude/ChatGPT, covers all new fields

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

- FIRE mathematics: 4% rule, Trinity Study ([Wikipedia](https://en.wikipedia.org/wiki/Trinity_study))
- Dual-Wheel Asset Allocation (沪深300 + S&P 500 + Gold + Bonds)
- China third-pillar pension (个人养老金) rules
- FIRE community research on savings rate, Coast FIRE, geographic arbitrage
- Additional sources in [`playbooks/book-summaries/`](playbooks/book-summaries/)

## 🚀 How to Use

### 1️⃣ Try the demo (no install needed)

Open **`https://adashuai5.github.io/awesome-financial-freedom/demo/`**

First thing you'll see: 5 yes/no questions that detect your FIRE stage in under 30 seconds. Then a stage-specific tool loads automatically — no need to read the full calculator.

### 2️⃣ Fill in your numbers (optional but recommended)

The main form takes: age, income, expenses, assets (bank / 公积金 / stocks / real estate), debt, and risk profile. New fields: 个人养老金 contribution, income growth rate, side income, target retirement age, and retirement lifestyle preference.

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
