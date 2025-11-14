export const siteConfig = {
  title: 'Sheep 的项目导航',
  subtitle: '把分散的个人项目收拢到一个落地页',
  description:
    '这里是我平时折腾的一些小项目和实验 Demo，方便自己和朋友快速找到入口。',
  links: {
    github: 'https://github.com/wingsheep', // 可以改成你的 GitHub 主页
    // blog: 'https://your-blog.com',
  },
  // 默认主题：'light' | 'dark' | 'system'
  defaultTheme: 'system',
}

// 分组/分类配置：
// 你可以把项目按 group 拆开，比如「个人小工具」「工作相关」「实验 / Demo」等。
// 只需要在这里维护分组和项目列表，页面会自动渲染。
export const projectGroups = [
  {
    id: 'vibeCoding',
    name: 'AI VIBE CODING',
    description: 'AI 结对编程一些有意思的玩意儿',
    projects: [
      {
        id: 'vibeCoding-1',
        name: '研发委员会',
        description: '帮助有意参与的同事快速了解研发委员会制度与各项开放项目，便于参考与对齐；内容以团队共识为准，欢迎指正完善。',
        techStack: ['Vue 3', 'Vite', 'Mermaid'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/codemembers',
        demoUrl: 'https://codemembers.happyfly.top/',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'vibeCoding-2',
        name: '1024 程序员节｜代码猜诗词',
        description: '公司活动，把程序员的浪漫写在代码里',
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
    description: '分享Slides & code for my talks',
    projects: [
      {
        id: 'talks-1',
        name: '演讲导航页',
        description: '演讲导航页，统一入口，随时回看',
        techStack: ['Vue 3', 'Vite', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/talks',
        demoUrl: 'https://www.talks.happyfly.top/',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'talks-2',
        name: 'Vue3 优雅的开发项目',
        description: '帮助有意参与的同事快速了解研发委员会制度与各项开放项目，便于参考与对齐；内容以团队共识为准，欢迎指正完善。',
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
    description: '日常会用到的一些小工具集合。',
    projects: [
      {
        id: 'tools-1',
        name: 'Cosbrowser',
        description: '一个Raycast插件用于管理Cosbrowser',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'https://github.com/wingsheep/cosbrowser',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-4',
        name: 'Hgj Ops Raycast',
        description: '一个整合了海管家国内外伏羲平台的 Raycast 扩展。',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/hgj-ops-raycast',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-6',
        name: 'Sync Locale App',
        description: '海外舱单语言包同步 跨平台app，便于开发测试同步语言包',
        techStack: ['Electron', 'Vue'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/sync-locale-app',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-5',
        name: 'CodeVar',
        description: 'CodeVar 是由有道翻译 api 支持的 Raycast 扩展变量命名工具。',
        techStack: ['React', 'TypeScript'],
        repoUrl: 'http://git.hgj.net/taoxiang.tao/code-var',
        demoUrl: '',
        status: 'online', // online | wip | archived
        highlight: false,
      },
      {
        id: 'tools-2',
        name: 'Tampermonkey Script',
        description: '工作中难免会遇到的一些重复的步骤导致心情很不美丽，使用脚本解决省心省力',
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
    description: '一些技术尝试或玩具项目。',
    projects: [
      {
        id: 'experiments-1',
        name: 'Ehr App',
        description: '基于Electron，显示每日工作时间，便于下班打卡',
        techStack: ['Electron', 'Vue'],
        repoUrl: 'https://github.com/wingsheep/ehr-app',
        demoUrl: '',
        status: 'wip',
        highlight: false,
      },
      {
        id: 'experiments-2',
        name: 'Certbot',
        description: 'Certbot 自动续期 + 七牛云证书上传',
        techStack: ['Shell', 'Python'],
        repoUrl: 'https://github.com/wingsheep/ops',
        demoUrl: '',
        status: 'wip',
        highlight: false,
      },
    ],
  },
]
