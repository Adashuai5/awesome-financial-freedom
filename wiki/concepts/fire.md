# FIRE (Financial Independence, Retire Early)

> 通过最大化储蓄率和投资收益，在传统退休年龄之前实现财务独立的目标。

## Key Points

- **核心公式**：目标资产 = 年支出 ÷ 安全提现率（通常 4%）
- **复利公式**：FV = PV(1+r)ⁿ + PMT×[(1+r)ⁿ-1]/r，用于计算达成年限
- **最低储蓄率**：一般建议 ≥50% 才能在 10-15 年内达成 FIRE
- **两种主要路线**：Fat FIRE（高支出/高目标）vs Lean FIRE（低支出/低目标）

## Details

### 目标资产计算
```
FIRE Target = Annual Expenses ÷ Safe Withdrawal Rate
Example: 108,000 ÷ 0.04 = 2,700,000 元
```

### 达成年限计算（复利公式）
```
n = ln((FV × r + PMT) / (PV × r + PMT)) / ln(1 + r)
其中：FV=目标资产, PV=当前储蓄, PMT=年储蓄, r=预期收益率
```

### 安全提现率（Safe Withdrawal Rate, SWR）
- 4% 规则源自 Trinity Study（1998），基于美国股债组合历史回测
- 实际提现率需根据寿命预期、投资组合、退休时长调整
- 早期退休（RE）比传统退休需要更保守的提取率（约 3-3.5%）

## Context

本项目 `awesome-financial-freedom` 的核心目标就是帮助用户计算和规划 FIRE 路径。
表单字段（当前存款、年收入、年支出、年储蓄、预期回报率、安全提现率）全部服务于 FIRE 计算。

## Related Pages
- [[concepts/asset-allocation]]
- [[concepts/safe-withdrawal-rate]]
- [[patterns/input-output-mapping]]

## Sources
- README.md — 项目概述和表单字段定义
- Trinity Study: https://en.wikipedia.org/wiki/Trinity_study
- JL Collins, _The Simple Path to Wealth_