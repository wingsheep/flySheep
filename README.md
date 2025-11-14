# flySheep · 个人项目导航

一个用 Vue 3 + Vite 搭建的「个人项目落地页」，把分散在各处的 Demo、工具和演讲项目收拢到一个入口。  
配置信息集中在一个文件里，增删项目只需要改配置即可。

## 功能概览

- 个人项目导航页（Claude 风格的卡片式布局）
- 支持按分组 / 分类展示项目（如 AI、工具、实验等）
- 支持按状态筛选：全部 / 已上线 / 开发中 / 已归档
- 明暗主题切换（极简圆点开关，记住上次选择）
- 自定义站点标题、副标题、描述和外链（GitHub / Blog）

## 配置说明

所有展示内容都集中在一个配置文件里：

- `src/config/projects.js`

主要配置项：

- `siteConfig`
  - `title`：页面主标题（左上角）。
  - `subtitle`：标题下的一句话说明。
  - `description`：页面顶部卡片中的简介文案。
  - `links.github`：GitHub 主页链接。
  - `links.blog`：博客 / 个人主页链接（可选）。
  - `defaultTheme`：默认主题，`'light' | 'dark' | 'system'`。
- `projectGroups`：分组数组，每个分组一个对象：
  - `id`：分组唯一标识。
  - `name`：分组名称（如「个人小工具」）。
  - `description`：分组描述（可选）。
  - `projects`：项目列表，字段包括：
    - `id`：项目唯一标识。
    - `name`：项目名称。
    - `description`：一句话说明。
    - `techStack`：技术栈数组（如 `['Vue 3', 'Vite']`）。
    - `repoUrl`：代码仓库链接。
    - `demoUrl`：在线预览地址（可为空字符串）。
    - `status`：项目状态：`'online' | 'wip' | 'archived'`。
    - `highlight`：是否高亮该项目卡片（`true | false`）。

你只需要维护 `siteConfig` 和 `projectGroups`，页面会自动根据配置渲染。

## 启动与构建

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 生产构建
npm run build
```

构建产物会输出到 `dist/` 目录，可直接部署到任意静态站点（如 Vercel、Netlify、GitHub Pages 或自建 Nginx）。

## 部署到 Netlify

仓库根目录已经添加了 `netlify.toml`，主要配置：

- `[build]`：使用 `npm run build` 构建，发布目录为 `dist`。
- `[[redirects]]`：将所有路径回退到 `/index.html`，保证前端路由在刷新时也能正常访问。

部署步骤（任选其一）：

- Git 集成：在 Netlify 选择本仓库，构建命令填 `npm run build`，Publish directory 填 `dist`（会自动读 `netlify.toml`）。
- 本地 CLI：安装 `netlify-cli` 后，在仓库根目录运行：

  ```bash
  netlify deploy --build
  ```

## 设计与主题

- 颜色体系基于 OKLCH，自定义在 `src/style.css` 中的 CSS 变量。
- 页面布局与交互动效参考 Claude 风格，整体偏简洁、低对比、轻阴影。
- 顶部使用 `src/assets/logo.png` 作为站点 Logo，同时也用作浏览器标签页图标。
