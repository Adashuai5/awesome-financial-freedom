# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> 一个 AI 原生的财务自由执行系统，不是收藏夹列表。
> 小白问 AI：我月薪 5000，存 1000，多久能退休？AI 直接给计划。

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/ada/awesome-financial-freedom/discussions)

**Last updated**: see [`git log --reverse --format="%ad" | head -1`](https://github.com/ada/awesome-financial-freedom/commits?author=ada) for the earliest commit date

![Demo: AI answers retirement and rebalancing](assets/hero-demo.svg)

## 🧭 快速导航

- **演示**: [`https://adashuai5.github.io/awesome-financial-freedom/demo/`](https://adashuai5.github.io/awesome-financial-freedom/demo/) (在线，无需安装)
- **Playbooks**（指南 + 教程）: [`playbooks/guides/`](playbooks/guides)
- **知识节点**: [`knowledge/nodes/`](knowledge/nodes)
- **工作流**: [`workflows/`](workflows)
- **Prompts & Agents**: [`prompts/`](prompts) · [`agents/`](agents)
- **Skills & Tools**: [`skills/`](skills) · [`tools/`](tools)
- **书籍摘要**: [`playbooks/book-summaries/`](playbooks/book-summaries)

## 🤔 这是什么？

**Awesome Financial Freedom** 是一个开源、AI 原生的财务自由知识库。它将 awesome 列表的结构化策划与 AI Skill 对话能力结合，实现 *零门槛* 学习。

这个项目不只是静态链接列表，它提供：

- 📚 **结构化 JSON 知识节点**：覆盖心态、储蓄、投资和 FIRE 原则。
- 🤖 **开箱即用的 AI Skills**：兼容 Claude 和 ChatGPT，你可以问：
  - _"我月薪 5000，存 1000，多久能退休？"_
  - _"我的组合是 70% 标普 500、30% 债券，帮我看看。"_
  - _"什么是'双轮配置'方法？"_
- 🧮 **嵌入式计算器**：公式透明、步骤可验证。
- 📍 **学习路径指南**：分阶段推进、个性化目标设定。
- ✅ **可执行行动指南**：快速见效、风险意识的第一步，见 [`playbooks/guides/actionable-steps.md`](playbooks/guides/actionable-steps.md)。

这是一个面向用户的财务自由规划工具。输入你的当前存款、年收入、年支出、预期回报率、安全提取率和资产配置，系统返回：

- FIRE 目标金额
- 预计达成年限
- 关键行动建议
- 组合再平衡指导

## 🎯 目标用户

- 想要一条直接通往财务自由的路径和可执行步骤的人
- 想存钱但不知道从哪开始年轻职场人
- 听说过 FIRE 但不知道怎么算的人
- 希望 AI 帮助规划财务的人
- 想把财务策略转化为可执行计划的人

## ✨ 为什么要做这个？

互联网上充斥着个人理财博客、付费课程和零散建议。但**没有一个开源、结构化、AI 就绪的财务自由执行系统**，专门帮助人们把计划变成行动。

这个项目填补了这个空白：提供一个**社区驱动、透明、可执行的 AI 规划系统**。核心创新在于将结构化工作流、Prompt 模板和计算器逻辑整合为一个可用的执行引擎。

## 📚 知识来源

精选洞察来自：

- 托尼·罗宾斯《钱：七步创造终身收入》（[Amazon](https://www.amazon.com/Money-Master-Game-7-Simple/dp/1476757801)）
- JL·柯林斯《简单到足以让孩子管钱》（[Amazon](https://www.amazon.com/Simple-Path-Wealth-financial-independence/dp/1533667926)）
- FIRE 数学（4% 法则、Trinity Study）（[Wikipedia](https://en.wikipedia.org/wiki/Trinity_study)）
- 邱岩《让钱去工作》（双轮配置）
- 更多来源见 [`playbooks/book-summaries/`](playbooks/book-summaries/)

## 🔧 如何使用

### 1️⃣ 立即体验（无需安装）

打开 **`https://adashuai5.github.io/awesome-financial-freedom/demo/`** 并输入你的数字，你会获得：

- **FIRE 目标金额** 和预计达成年限
- 关键行动建议
- 组合再平衡指导

### 2️⃣ 准备你的数字

打开演示前，收集：当前存款、年收入、年支出、预期回报率、安全提取率、资产配置（如 60% 股票 / 40% 债券）。

### 3️⃣ 深入探索

拿到一次结果后，可深入了解系统：

| 如果你想… | 去哪里 |
|----------|--------|
| 本地运行 + AI 助手 | [`playbooks/tutorials/getting-started.md`](playbooks/tutorials/getting-started.md) |
| 了解系统设计 | [`playbooks/guides/money-os-architecture.md`](playbooks/guides/money-os-architecture.md) |
| 通过 CLI 执行 | `node tools/run-workflow.js workflows/fire_planning.yaml`（需 Node.js ≥18） |
| 浏览全部工作流 | [`workflows/`](workflows) |

## 📖 知识结构

七个从心态到财务自由的递进阶段：

| 阶段 | 目录 | 你将学到 |
|------|------|---------|
| 01 — 心态 | [`knowledge/nodes/01-mindset/`](knowledge/nodes/01-mindset) | 财务自由真正意味着什么；钱是工具而非目标 |
| 02 — 基础 | [`knowledge/nodes/02-foundation/`](knowledge/nodes/02-foundation) | 应急基金、保险、消除高息债务 |
| 03 — 积累 | [`knowledge/nodes/03-accumulation/`](knowledge/nodes/03-accumulation) | 提高储蓄率；副业收入；复利基础 |
| 04 — 配置 | [`knowledge/nodes/04-allocation/`](knowledge/nodes/04-allocation) | 资产配置、多元化、指数基金、再平衡 |
| 05 — 自动化 | [`knowledge/nodes/05-automation/`](knowledge/nodes/05-automation) | 自动储蓄和投资，让纪律成为自动习惯 |
| 06 — 自由 | [`knowledge/nodes/06-freedom/`](knowledge/nodes/06-freedom) | FIRE 数学、安全提取率、Coast FIRE、Barista FIRE |
| 07 — 学习路径 | [`knowledge/nodes/07-learning-path/`](knowledge/nodes/07-learning-path) | 阶段路线图；下一步该读哪个节点 |

## 🤝 贡献

欢迎贡献！请阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 了解：
- 如何报告问题或建议新知识节点
- Pull Request 工作流和编码风格
- 如何添加 Prompts、工作流或 Playbook 内容

## 📄 许可

- **知识内容**：采用知识共享署名-相同方式共享 4.0 国际协议（CC BY-SA 4.0）——详见 [LICENSE](LICENSE) 文件。
- **代码与工具**：采用 MIT 协议——详见 [LICENSE-CODE.md](LICENSE-CODE.md) 文件。