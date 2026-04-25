# 计划：合并 demo 文件，删除冗余副本

## Goal

解决 demo 文件三份冗余问题，统一为一份，同时支持本地开发和 GitHub Pages 部署。

## Current Context

### 现状

| 路径 | 内容 | 说明 |
|------|------|------|
| `demo/index.html` | 与 `docs/index.html` md5 相同 | 本地开发 |
| `docs/demo/index.html` | 实际部署版本，6 行 redirect 后被完整内容替换 | GitHub Pages 实际路径 |
| `docs/index.html` | 与 `demo/index.html` md5 相同 | 冗余，docs/ 是 gh-pages root |
| `demo/style.css` | 与 `docs/style.css` md5 相同 | 冗余 |
| `docs/demo/fire-assessment-form.html` | 表单 | 仅 docs/demo/ 有 |

### 关键发现

- `docs/` 是 GitHub Pages 的 root（`docs/.nojekyll` 存在）
- 部署路径：`https://adashuai5.github.io/awesome-financial-freedom/demo/`
- `demo/` 有 `server.js`（本地静态服务器 + 工作流执行），`docs/demo/` 没有
- `docs/demo/index.html` 的 CSS 路径是 `../style.css`（相对于 docs/），本地 `demo/index.html` 的是 `style.css`（相对于 demo/）
- CSS/JS 文件内容完全相同

## Proposed Approach

**采用 `demo/` 作为唯一源，`docs/demo/` 只做符号链接或复制构建**：

方案 B（最简单）：`demo/` 作为唯一源，本地开发和 GitHub Pages 共用，删除 `docs/demo/` 和 `docs/index.html`，通过构建脚本将 `demo/` 内容同步到 `docs/demo/`。

具体：
- `demo/index.html` — 修改 CSS 路径为 `../style.css`（与 docs 部署路径兼容）
- `demo/style.css` 保留（内容与 docs/style.css 相同，可直接用）
- 删 `docs/demo/` 和 `docs/index.html`
- 添加 `scripts/build-demo.js`：将 `demo/` 下的 index.html 和 style.css 复制到 `docs/demo/`，路径重写（`style.css` → `../style.css`）
- `package.json` 的 `predeploy` 调用此脚本
- README.md 和 README.zh-CN.md 的 Demo URL 改为 `https://adashuai5.github.io/awesome-financial-freedom/demo/`（已有）

## Step-by-Step Plan

### Step 1: 创建构建脚本

创建 `scripts/build-demo.js`：

1. 读取 `demo/index.html`
2. 替换 CSS 路径 `href="style.css"` → `href="../style.css"`
3. 将修改后的内容写入 `docs/demo/index.html`
4. 复制 `demo/style.css` → `docs/demo/style.css`
5. 复制 `demo/fire-assessment-form.html` → `docs/demo/fire-assessment-form.html`
6. 创建目录 `docs/demo/` 如果不存在

### Step 2: 修改 `demo/index.html`

将 `<link rel="stylesheet" href="style.css" />` 改为 `<link rel="stylesheet" href="../style.css" />`。

验证：本地 `node demo/server.js` 仍然可正常访问（Caddy/静态服务器会 serve demo/ 下的相对路径）。

### Step 3: 更新 `package.json`

```json
{
  "scripts": {
    "predeploy": "node scripts/build-demo.js",
    "build:demo": "node scripts/build-demo.js"
  }
}
```

### Step 4: 删除冗余文件

```bash
rm -rf docs/demo/
rm docs/index.html
```

### Step 5: 更新 `.gitignore`（如有需）

确保 `docs/demo/` 是构建产物，不提交源码。

### Step 6: 运行构建验证

```bash
npm run build:demo
ls docs/demo/
```

确认 `docs/demo/index.html` 存在且 CSS 路径为 `../style.css`。

### Step 7: 更新 README Demo URL（如还未改）

确认 Demo URL 为 `https://adashuai5.github.io/awesome-financial-freedom/demo/`。

## Files Likely to Change

| 文件 | 操作 |
|------|------|
| `demo/index.html` | 修改 CSS href |
| `scripts/build-demo.js` | 新建 |
| `package.json` | 添加 build:demo / predeploy |
| `docs/demo/` | 删除后由构建重新生成 |
| `docs/index.html` | 删除 |
| `README.md` | 确认 Demo URL 正确 |
| `README.zh-CN.md` | 确认 Demo URL 正确 |

## Tests / Validation

1. `npm run build:demo` — 无报错，`docs/demo/index.html` 生成
2. `node demo/server.js` — 浏览器打开 http://localhost:4000 能正常显示 demo
3. `node tools/check-readmes-sync.js` — README 中英同步检查通过
4. `npm test` — 全部测试通过

## Risks / Tradeoffs / Open Questions

1. **本地 server.js 的相对路径**：修改 `demo/index.html` 的 CSS href 为 `../style.css` 后，本地 `node demo/server.js` 仍用相对路径访问 style.css（因为 server 从 demo/ 目录 serve 文件），但需要验证 `server.js` 的静态文件 serve 逻辑。
2. **fire-assessment-form.html**：当前在 `demo/` 下是否有？需要确认 `demo/` 是否已有该文件，还是只在 `docs/demo/` 有。
3. **server.js 还执行 workflow**：本地 server.js 还负责运行工作流，所以不能简单用静态服务器替代，`demo/server.js` 必须保留。
4. **git history**：`docs/demo/` 和 `docs/index.html` 的 git 历史会消失。如果需要恢复历史，可以用 `git mv` 或保留旧 commit 引用。