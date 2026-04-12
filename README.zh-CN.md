# Awesome Financial Freedom 🕊️

[English](./README.md) | [简体中文](./README.zh-CN.md)

> 一个面向财务自由的结构化知识库，以 AI Skill 形式呈现，让对话式学习变得轻松省力。

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🧭 项目导航

- **文档入口**：[`docs/README.md`](docs/README.md)
- **快速入门**：[`docs/tutorials/getting-started.md`](docs/tutorials/getting-started.md)
- **书籍摘要**：[`docs/book-summaries`](docs/book-summaries)
- **Skill 提示模板**：[`prompts/system-prompt.md`](prompts/system-prompt.md)
- **知识节点**：[`knowledge/nodes/`](knowledge/nodes)
- **Skills**：[`skills/`](skills)
- **工具**：[`tools/`](tools)
- **贡献指南**：[`CONTRIBUTING.md`](CONTRIBUTING.md)

## 🤔 这是什么？

**Awesome Financial Freedom** 是一个开源、AI 原生的财务自由知识库。它把 awesome list 的结构化策划与 AI Skill 的对话能力结合起来，实现“轻松”学习。

这个仓库不仅仅是静态链接列表，它还提供：

- 📚 包含心态、储蓄、投资和 FIRE 原则的**结构化 JSON 知识节点**
- 🤖 支持 Claude 和 ChatGPT 的**即用型 AI Skills**，你可以问：
  - _“我每月收入 5000 美元，存 1000 美元。我什么时候可以退休？”_
  - _“帮我看看我的组合：70% 标普 500，30% 债券。”_
  - _“什么是‘双轮资产配置’方法？”_
- 🧮 内置计算器和公式，提供透明、逐步的答案

**零配置，直接对话。**

### 🎯 目标用户

- 财务初学者（理财小白）
- FIRE 探索者
- 希望建立健康金钱观的普通人

## ✨ 为什么要做这个？

网络上充斥着个人理财博客、付费课程和零散建议，但缺少一个专注于财务自由、开源、结构化、适配 AI 的知识库。

本项目通过提供**社区驱动、透明、可对话的学习路径**来填补这一空白。项目的核心创新在于把 awesome list 结构化策划和 AI Skill 对话能力结合起来，实现“轻松”学习。

## 📚 知识来源

精选自：

- Tony Robbins 的《Money: Master the Game》三部曲（[Amazon](https://www.amazon.com/Money-Master-Game-7-Simple/dp/1476757801)）
- JL Collins 的《The Simple Path to Wealth》（[Amazon](https://www.amazon.com/Simple-Path-Wealth-financial-independence/dp/1533667926)）
- FIRE 数学（4% 规则、三一研究）（[Wikipedia](https://en.wikipedia.org/wiki/Trinity_study)）
- 阿秋的《让钱去工作》（双轮资产配置）（[JD.com](https://item.jd.com/100240963394.html) 或搜索“让钱去工作 阿秋”）
- 以及更多内容（参见 `/docs/book-summaries`）

## 🚀 如何使用（最省力方式）

### 1️⃣ 与 AI 对话（最简单）

- 将 **Awesome Financial Freedom Skill** 添加到你的 Claude 或 ChatGPT
- 开始提问，AI 会检索相关知识节点并为你执行计算

### 2️⃣ 浏览知识库

克隆仓库并查看 `/knowledge/nodes` 目录。每个 `.json` 文件包含：

- `question_patterns`（AI 会监听的提问方式）
- `answer`，包括 summary、formula、example、limitations
- `action_item`（具体的下一步行动）
- `source` 引用

### 3️⃣ 自建工具

使用结构化数据和计算器（`/tools`）将财务自由逻辑集成到你自己的应用中。

## 📖 知识结构

## 🤝 贡献

欢迎贡献！请查看我们的 [Contributing Guide](CONTRIBUTING.md) 获取参与项目的详细说明。

## 📄 许可

- **知识内容**：采用 Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) 许可，详见 [LICENSE](LICENSE)
- **代码与工具**：采用 MIT 许可，详见 [LICENSE-CODE.md](LICENSE-CODE.md)
