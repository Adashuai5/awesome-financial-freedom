# Wiki Ingest Log

## 2026-04-25: Initial ingest — README review and FIRE knowledge base

**Source**: README.md, README.zh-CN.md, demo form analysis (demo/index.html)
**New pages**: 5
- concepts/fire.md
- concepts/asset-allocation.md
- concepts/safe-withdrawal-rate.md
- patterns/input-output-mapping.md
- patterns/bilingual-documentation.md

**Updated pages**: none (initial ingest)

**New cross-references**:
- concepts/fire → concepts/asset-allocation (通过"再平衡"关联)
- concepts/fire → concepts/safe-withdrawal-rate (通过 4% 规则关联)
- concepts/fire → patterns/input-output-mapping (表单映射示例)
- concepts/asset-allocation → patterns/input-output-mapping (通过配置字段关联)
- concepts/safe-withdrawal-rate → concepts/fire (SW 公式中的 FIRE 三角)
- concepts/safe-withdrawal-rate → concepts/asset-allocation (通过股债组合关联)
- patterns/input-output-mapping → concepts/fire (FIRE 字段示例)
- patterns/input-output-mapping → patterns/bilingual-documentation (双语审查来源)
- patterns/bilingual-documentation → patterns/input-output-mapping (审查修复来源)

**Notes**:
- 本次同时完成了 README.md 和 README.zh-CN.md 的 P1+P2 问题修复
- 修复内容：表单字段描述补全（新增年收入字段）、删除重复 Demo section、
  修复"零门槛"引号风格、"的的下一步"重复字、移除悬空 data/ 导航引用