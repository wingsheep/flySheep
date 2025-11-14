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
    id: 'personal-tools',
    name: '个人小工具',
    description: '日常开发和工作中顺手写的一些提升效率的小工具集合。',
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
        id: 'tools-6',
        name: 'Sync Locale App',
        description: '海外舱单语言包同步的跨平台小应用，方便开发和测试快速同步语言包。',
        techStack: ['Electron', 'Vue'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/sync-locale-app',
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
        status: 'wip',
        highlight: false,
      },
      {
        id: 'experiments-2',
        name: 'Certbot',
        description: '使用 Certbot 自动续期证书，并把最新证书自动上传到七牛云。',
        techStack: ['Shell', 'Python'],
        repoUrl: 'https://github.com/wingsheep/ops',
        demoUrl: '',
        status: 'wip',
        highlight: false,
      },
    ],
  },
]
