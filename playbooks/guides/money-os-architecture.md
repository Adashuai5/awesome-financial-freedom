# Money OS 架构

## 系统概述

Money OS 是将 `awesome-financial-freedom` 仓库从“半结构化知识库”升级为“AI 可执行赚钱操作系统”的架构方案。它将知识节点、工作流、Prompt 模板和代理执行能力组合为一个可运行的系统。

## 核心组成部分

- `knowledge/nodes/`
  - 继续作为财务概念、原则和回答逻辑的唯一可信来源。
  - 每个节点都包含 `question_patterns`、`answer`、`action_item` 等字段，支持 AI 问答和知识检索。

- `playbooks/`
  - 存放人类可读的操作手册、教程和书籍摘要。
  - 迁移自原来的 `docs/`，用于提供背景知识与实践指南。

- `prompts/`
  - 存放原子级 Prompt 模板，用于驱动工作流中的具体交互步骤。
  - 模板使用占位符如 `{{niche}}`、`{{topic}}`，便于动态填充。

- `workflows/`
  - 存放 AI 可执行的工作流定义，使用标准化的 YAML 结构。
  - 每个工作流由步骤组成，包含 `prompt`、`calculator`、`api_call`、`condition` 等类型。

- `agents/`
  - 存放代理配置和规范。
  - 定义代理如何解析工作流、调用工具、处理错误以及记录执行日志。

- `tools/calculators/`
  - 保持为可复用的计算模块。
  - 为工作流中的计算步骤提供逻辑支持。

- `tools/run-workflow.js`
  - 提供 CLI 运行器，能够解析工作流 YAML 并按顺序模拟执行步骤。
  - 作为 AI 执行模型的演示实现。

## 工作流关系

1. 用户或代理选择一个工作流文件，例如 `workflows/twitter_ai_growth.yaml`。
2. 系统加载工作流定义，并识别每个步骤的类型。
3. 对于 `prompt` 步骤，读取 `prompts/` 中对应的模板，并生成具体指令。
4. 对于 `calculator` 步骤，调用 `tools/calculators/` 中的计算器模块进行处理。
5. 对于 `api_call` 步骤，代理可执行外部 API 请求。
6. 对于 `condition` 步骤，判断流程分支并决定下一步。

## 数据流

- 输入参数由工作流文件中的 `input.parameters` 定义。
- 运行过程中，步骤结果会累积到输出对象中。
- 最终输出由 `output` 字段结构化返回，并可用于后续执行或审计。

## 代理执行规范

代理需要遵循以下约定：

- `workflows/` 中的每个文件都是可执行单元。
- `prompts/` 目录内的模板必须与工作流中的 `prompt_id` 对应。
- 每个步骤的 `on_error` 定义决定失败时的行为。
- 日志输出采用统一的 JSON 格式，包含时间戳、工作流名称、步骤 ID 和状态信息。

## 升级目标

- 从“知识库”转向“操作系统”意味着：
  - 加强结构化执行能力。
  - 提供可复用的工作流与模板。
  - 让 AI 代理能够直接消费、执行和反馈。

## 未来扩展

- 增加更多垂直获利路径工作流。
- 将 `playbooks/` 与 `workflows/` 更紧密结合，支持“从手册到执行”的闭环。
- 为 `agents/` 增加更多执行引擎适配，如 Hermes、OpenClaw、RPA 等。
