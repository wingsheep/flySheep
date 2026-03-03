export const siteConfig = {
  title: 'Sheep 的项目导航',
  subtitle: '把分散的个人项目收拢到一个落地页',
  description:
    '把平时折腾的个人项目和实验 Demo 收拢到一个地方，方便自己和朋友随时找到入口。',
  links: {
    github: 'https://github.com/wingsheep', // 可以改成你的 GitHub 主页
    // blog: 'https://your-blog.com',
  },
  // 默认主题：'light' | 'dark' | 'system'
  defaultTheme: 'system',
}

// 分组 / 分类配置：
// 按类别组织项目，比如「AI 结对编程」「个人小工具」「实验 / Demo」等。
// 只需要维护这里的分组和项目列表，导航页会自动渲染更新。
export const projectGroups = [
  {
    id: 'top',
    name: '置顶',
    description: '置顶一些新颖且有应用场景的项目',
    projects: [
      {
        id: 'top-4',
        name: 'UI自动化测试Demo',
        description:
          '可视化录制 + 后台执行的 UI 自动化平台 MVP。',
        techStack: ['Playwright', 'Node.js', 'Docker', 'Nuxt 4'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/ui-test-demo',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'top-3',
        name: 'Mcp Use Demo',
        description:
          'MCP Use + DeepSeek 的完整链路 Demo，包含 MCP Server/UI resources、MCP Client/Agent、API 层与 Nuxt Web 前端。',
        techStack: ['MCP Use', 'langchain/openai', 'Zod', 'Typescript', 'Nuxt 4'],
        repoUrl: 'https://github.com/wingsheep/mcp-use-demo',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'top-1',
        name: '伏羲平台 MCP',
        description:
          '封装海管家/伏羲平台的登录、项目查询、发布、消息通知及常用运维接口，同时支持 MCP 服务端 和 CLI 命令行 两种使用方式 以及提供了 AI Agent 技能与工作流调用。',
        techStack: ['Mcp', 'Zod', 'Typescript'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/hgj-fuxi-mcp',
        demoUrl: '',
        status: 'wip', // online | wip | archived
        highlight: false,
      },
      {
        id: 'top-2',
        name: '海管家 CI CD',
        description:
          '海管家项目部署相关脚本导航目录。',
        techStack: ['Node.js'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/hgj-cicd',
        demoUrl: '',
        status: 'archived', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'vibeCoding',
    name: 'AI VIBE CODING',
    description: '和 AI 做结对编程时顺手产出的一些有意思的小玩意儿。',
    projects: [
      {
        id: 'vibeCoding-1',
        name: '研发委员会',
        description:
          '帮助有意参与的同事快速了解研发委员会的制度与开放项目，便于参考、对齐和持续完善。',
        techStack: ['Vue 3', 'Vite', 'Mermaid'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/codemembers',
        demoUrl: 'https://codemembers.happyfly.top/',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'vibeCoding-2',
        name: '1024 程序员节｜代码猜诗词',
        description: '公司 1024 活动，把程序员的浪漫写进代码，用代码来猜诗词。',
        techStack: ['HTML'],
        repoUrl: 'https://github.com/wingsheep/code-poem-1024',
        demoUrl: 'https://codepoem.happyfly.top/',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'talks',
    name: 'TALKS',
    description: '演讲相关内容的统一入口，Slides 与 Demo 代码集中存放在这里。',
    projects: [
      {
        id: 'talks-1',
        name: '演讲导航页',
        description: '把过往演讲集中在一个导航页里，方便自己和同事随时回看。',
        techStack: ['Vue 3', 'Vite', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/talks',
        demoUrl: 'https://www.talks.happyfly.top/',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'talks-2',
        name: 'Vue3 优雅的开发项目',
        description:
          '和大家分享如何用 Vue 3 + Vite 组装一个体验相对优雅、可维护性不错的前端项目。',
        techStack: ['Vue 3', 'Vite', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/talks/tree/master/2022-07-10',
        demoUrl: 'https://www.talks.happyfly.top/2022/vue3-ecosystem/1',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'vscode-plugins',
    name: 'VS Code 插件',
    description: '提升编码体验的 VS Code 扩展。',
    projects: [
      {
        id: 'tools-10',
        name: 'Cosbrowser Autocomplete',
        description:
          '一个 VS Code 插件，编写代码时智能补全腾讯云 COS 里的文件路径，支持 CDN 域名替换和图片预览。',
        techStack: ['VS Code', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/cosbrowser-autocomplete',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'raycast-plugins',
    name: 'Raycast 插件',
    description: '使用 Raycast 提升生产力的效率工具。',
    projects: [
      {
        id: 'tools-1',
        name: 'Cosbrowser',
        description: '一个 Raycast 插件，用于快捷管理和打开 Cosbrowser 相关入口。',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/cosbrowser',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-4',
        name: 'Hgj Ops Raycast',
        description: '一个整合了海管家国内外伏羲平台常用入口的 Raycast 扩展。',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/hgj-ops-raycast',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-5',
        name: 'CodeVar',
        description: '一个基于有道翻译 API 的 Raycast 扩展，用来辅助生成代码中的变量命名。',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/code-var',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'desktop-apps',
    name: '桌面端 APP',
    description: '独立运行的桌面应用程序。',
    projects: [
      {
        id: 'tools-9',
        name: 'Sync GitLab Locale (Tauri v2)',
        description: '使用Tauri v2 重构的海外舱单语言包同步的跨平台小应用。',
        techStack: ['Tauri', 'Vue'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/sync-locale-app_by_tauri-v2',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-6',
        name: 'Sync Locale App',
        description: '海外舱单语言包同步的跨平台小应用，方便开发和测试快速同步语言包。',
        techStack: ['Electron', 'Vue'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/sync-locale-app',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'browser-extensions',
    name: '浏览器插件',
    description: '增强浏览器功能的插件与脚本。',
    projects: [
      {
        id: 'tools-2',
        name: 'Tampermonkey Script',
        description: '用油猴脚本把工作中一些重复又烦人的小步骤自动化，省心省力。',
        techStack: ['Javascript'],
        repoUrl: 'https://github.com/wingsheep/tampermonkey-script',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
    ],
  },
  {
    id: 'experiments',
    name: '实验 / Demo',
    description: '一些技术尝试、概念验证和玩具项目的集合。',
    projects: [
      {
        id: 'experiments-1',
        name: 'Ehr App',
        description: '基于 Electron，用来记录和展示每日工作时长，方便下班打卡与自查。',
        techStack: ['Electron', 'Vue'],
        repoUrl: 'https://github.com/wingsheep/ehr-app',
        demoUrl: '',
        status: 'archived',
        highlight: false,
      },
      {
        id: 'experiments-2',
        name: 'Certbot',
        description: '使用 Certbot 自动续期证书，并把最新证书自动上传到七牛云。',
        techStack: ['Shell', 'Python'],
        repoUrl: 'https://github.com/wingsheep/ops',
        demoUrl: '',
        status: 'archived',
        highlight: false,
      },
    ],
  },
]
