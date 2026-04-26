# Workflows

本目录包含可执行的 Money OS 工作流定义。每个文件描述了一条可由 AI 代理执行的业务流程，旨在将财务问题转化为可执行计划并支持快速验证。

当前可用工作流：

- `index_fund_dca.yaml`
- `fire_planning.yaml`
- `portfolio_rebalancing.yaml`

这些工作流的核心价值在于：

- 通过 `prompt` 步骤让 AI 识别问题并生成分析逻辑
- 通过 `calculator` 步骤将财务计算转化为明确结论
- 通过 `output` 结构生成可执行的行动项和计划

未来可扩展为：

- 财务规划与预算自动化
- 被动收入组合构建
- 资产配置与再平衡策略
