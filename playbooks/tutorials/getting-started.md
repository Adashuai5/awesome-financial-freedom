# 财务自由入门指南

## 你会得到什么

 Awesome Financial Freedom 是一个本地 AI 财务规划助手。它通过可执行的工作流，把理财概念转化为具体的数字和行动计划——不是空洞的"你要努力赚钱"，而是算出来"你现在有多少、还需要多少、怎么走"。

## 第一步：运行本地 Web 计算器（5分钟）

```bash
cd ~/ada/awesome-financial-freedom
node demo/server.js
# 浏览器打开 http://localhost:4000
```

这会启动 FIRE 规划计算器。填入你的：
- 当前存款
- 年收入 / 年支出
- 预期投资回报率

点击"计算"，得到你的 FIRE 时间线——具体多少年、目标资产需要多少、每月要存多少。

## 第二步：了解你的知识节点

从第一个节点开始读：

```
knowledge/nodes/01-mindset/what-is-financial-freedom.json
```

每个节点结构相同：

| 字段 | 内容 |
|------|------|
| `answer.summary` | 一句话定义 |
| `answer.core_concept` | 核心概念解释 |
| `answer.formula` | 核心公式 |
| `answer.example` | 真实场景计算 |
| `action_item` | 读完要做的第一件事 |

知识库共 27 个节点，按 7 个章节组织，从心态到具体路径再到高级策略。

完整索引：
```
knowledge/index.json
```

## 第三步：用 AI 对话（推荐）

把 `skills/claude-skill.md` 的内容作为 system prompt 粘贴到 Claude，然后问：

> "我今年 30 岁，存款 20 万，年收入 18 万，年支出 10 万，帮我算 FIRE 计划"

系统会结合知识库节点，输出包含具体数字和可执行步骤的规划。

也可以直接和这个项目对话：
```bash
# 使用 workflow-runner 走 CLI
node tools/workflow-runner.js fire_planning --savings 200000 --income 180000 --expenses 100000
```

## 第四步：阅读实战手册

如果你更喜欢文字指南，而不是和 AI 对话：

| 手册 | 适合人群 |
|------|---------|
| `playbooks/guides/actionable-steps.md` | 完全零基础 |
| `playbooks/guides/learning-path.md` | 想系统学习FIRE |
| `playbooks/tutorials/fire-assessment-form.html` | 想做完整的FIRE评估 |

## 第五步：了解系统架构（可选）

`playbooks/guides/money-os-architecture.md` 描述了这个项目的设计思路——如何把分散的理财知识变成可执行的工作流。如果你熟悉 YAML，可以直接写自己的 workflow。

## 常见问题

**Q: 需要多少钱开始？**
A: 理论上 0 元就可以，但建议你先有 3 个月应急基金再开始认真规划。

**Q: 我的投资数据会不会上传？**
A: 不会。所有计算都在本地执行，不经过任何服务器。

**Q: 计算结果准确吗？**
A: 模型依赖你输入的数字和预设的回报率假设（默认 7% 股市历史平均）。实际结果会波动，不构成投资建议。

## 下一步

1. 跑通计算器，填入你真实的数字
2. 读 `what-is-financial-freedom` 和 `savings-rate` 两个节点（约 10 分钟）
3. 用 AI 问一个和你当前财务状况相关的问题