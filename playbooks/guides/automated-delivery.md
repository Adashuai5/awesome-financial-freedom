# 自动化交付流程

当代码推送到 `main` 分支时，GitHub Actions 会自动执行以下步骤：

1. **验证**：运行 `npm run validate` 检查所有知识节点是否符合 JSON Schema。
2. **测试**：运行 `npm test` 确保计算器功能正确。
3. **构建技能**：运行 `npm run build:skills` 生成最新的 Claude/ChatGPT 技能文件。
4. **生成任务**：运行 `npm run generate:task` 创建代理可执行的任务描述文件（Markdown + YAML）。
5. **交付代理**：通过 Webhook 将任务文件发送给 OpenClaw/Hermes 代理执行。
6. **结果处理**：代理执行完毕后将结果返回给 CI（后续扩展）。

## 配置要求

- 在仓库 Secrets 中添加 `AGENT_TOKEN`，值为代理 Webhook 的认证令牌。
- 在仓库 Secrets 中添加 `AGENT_URL`，值为代理的 Webhook URL，例如 `https://your-agent.example/api/tasks`。
- `.github/workflows/agent-deliver.yml` 将使用 `AGENT_URL` 和 `AGENT_TOKEN`；如果未配置，这一步会自动跳过。

## 任务格式示例

---

id: "task-20260414-001"
title: "财务自由知识库更新任务"
steps:

- step: 1
  description: "解释复利计算器的使用场景。"
- step: 2
  description: "计算本金20000元，年利率6%，15年后的本息和。"

---

# 任务说明

请执行上述步骤并返回结果。

## 后续优化

- 根据实际变更的节点动态生成步骤。
- 增加结果接收和审计日志记录。
- 实施 Webhook 签名校验。

请在 package.json 的 scripts 中添加以下命令：
"generate:task": "node scripts/generateTask.js"
