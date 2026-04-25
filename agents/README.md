# Agents

这是仓库中 Agent 定义和执行器适配器的目录，负责将 AI 工作流转化为真实执行。当前包含：

- `openclaw.yaml` — OpenClaw 执行器定义，用于让 OpenClaw 解析并执行 Money OS 工作流。

未来可以添加：

- Hermes 代理适配器
- 通用 LLM 执行代理
- API 中间件和任务调度适配器

本目录的核心价值是：将“可执行工作流”连接到“实际代理执行”，支持快速验证与迭代。
