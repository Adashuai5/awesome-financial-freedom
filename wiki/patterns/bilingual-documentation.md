# Bilingual Documentation (双语文档维护)

> 在支持多语言的项目中，保持 EN/ZH README 结构、内容和更新节奏同步的实践。

## Problem Context

双语文档（EN + ZH）容易出现：
- 某一语言版本更新后，另一语言忘记同步
- 内容结构不一致（EN 有某个 section，ZH 没有）
- 日期、版本号、字段列表等元数据漂移

## Solution

### 同步规则

1. **结构对齐**：EN 和 ZH 的 section 顺序和标题尽量一致
2. **同步触发**：每次修改 EN 后，立即检查 ZH 对应位置是否需要相同修改
3. **Last updated 同步**：两文件的更新日期必须同时更新（或 CI 自动维护）
4. **表单字段一致性**：表单变更时 EN 和 ZH 同时加上/删除字段描述

### 常见陷阱

| 陷阱 | 表现 | 解决 |
|------|------|------|
| 顶部重复 section | ZH 多一个"直接体验"section 与步骤 3 重复 | 删除重复，步骤 3 即为体验入口 |
| 悬空导航引用 | 导航写了 `data/` 但目录不存在 | 移除不存在目录的引用 |
| 漏字段描述 | 表单有 7 个字段，描述只写了 4 个 | 用 input-output mapping 表格确保覆盖 |
| 重复字 | "清晰的的下一步" | 写作后检查 |

## Related Pages
- [[patterns/input-output-mapping]]

## Sources
- awesome-financial-freedom README.md — 双语审查修复过程记录