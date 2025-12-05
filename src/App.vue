<script setup>
import { computed, ref, watchEffect, onMounted } from 'vue'
import { siteConfig, projectGroups } from './config/projects'
import LocalSearch from './components/LocalSearch.vue'
import Logo from './assets/logo.png'

const THEME_KEY = 'flysheep-theme'

const theme = ref('light')

const detectSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const initTheme = () => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null
  if (saved === 'light' || saved === 'dark') {
    theme.value = saved
    return
  }
  if (siteConfig.defaultTheme === 'dark' || siteConfig.defaultTheme === 'light') {
    theme.value = siteConfig.defaultTheme
    return
  }
  theme.value = detectSystemTheme()
}

onMounted(() => {
  initTheme()

  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const saved = localStorage.getItem(THEME_KEY)
      if (!saved) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', handler)
    }
  }
})

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
})

const toggleTheme = () => {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, next)
  }
}

const statusText = (status) => {
  const map = {
    online: '已上线',
    wip: '开发中',
    archived: '已归档',
  }
  return map[status] || status
}

const repoIcon = (url) => (url && url.includes('github.com') ? 'ri-github-line' : 'ri-gitlab-line')
const repoHost = (url) => {
  if (!url) return 'unknown'
  return url.includes('github.com') ? 'github' : 'gitlab'
}

const activeStatus = ref('all')
const hostFilter = ref('all') // all | github | gitlab
const isSearchOpen = ref(false)

const filteredGroups = computed(() => {
  return projectGroups
    .map((group) => {
      const projects =
        group.projects?.filter((project) => {
          const matchStatus =
            activeStatus.value === 'all' || project.status === activeStatus.value
          const matchHost =
            hostFilter.value === 'all' || repoHost(project.repoUrl) === hostFilter.value
          return matchStatus && matchHost
        }) ?? []

      return {
        ...group,
        projects,
      }
    })
    .filter((group) => (group.projects?.length ?? 0) > 0)
})

const projectCountLabel = computed(() => {
  const count = filteredGroups.value.reduce(
    (sum, group) => sum + (group.projects?.length ?? 0),
    0,
  )
  return `${count} 个项目`
})

const searchItems = computed(() =>
  projectGroups.flatMap((group) =>
    (group.projects || []).map((project) => ({
      ...project,
      groupId: group.id,
      groupName: group.name,
      statusLabel: statusText(project.status),
    })),
  ),
)

const searchShortcutLabel = computed(() => {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  return navigator.platform?.toLowerCase().includes('mac') ? '⌘ K' : 'Ctrl K'
})
</script>

<template>
  <div class="page">
    <div class="page-inner">
      <header class="page-header">
        <div class="avatar">
          <img :src="Logo" alt="Sheep logo" class="avatar-logo" />
        </div>
        <div class="title-block">
          <h1 class="title">
            {{ siteConfig.title }}
          </h1>
          <p class="subtitle">
            {{ siteConfig.subtitle }}
          </p>
        </div>
        <div class="header-right">
          <button
            type="button"
            class="search-trigger"
            aria-label="打开搜索"
            @click="isSearchOpen = true"
          >
            <i class="ri-search-line" aria-hidden="true"></i>
            <span class="search-trigger__label">搜索</span>
            <span class="search-trigger__shortcut">
              {{ searchShortcutLabel }}
            </span>
          </button>
          <div class="header-links" v-if="siteConfig.links">
            <a
              v-if="siteConfig.links.github"
              :href="siteConfig.links.github"
              target="_blank"
              rel="noreferrer"
              class="header-link header-icon"
              aria-label="GitHub"
            >
              <i class="ri-github-line" aria-hidden="true"></i>
            </a>
            <a
              v-if="siteConfig.links.blog"
              :href="siteConfig.links.blog"
              target="_blank"
              rel="noreferrer"
              class="header-link header-icon"
              aria-label="Blog"
            >
              <i class="ri-article-line" aria-hidden="true"></i>
            </a>
          </div>
          <button
            type="button"
            class="theme-toggle theme-toggle-icon"
            :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
            @click="toggleTheme"
          >
            <i
              :class="theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </header>

      <main class="page-main">
        <section class="intro">
          <p class="intro-text">
            {{ siteConfig.description }}
          </p>
        </section>

        <section class="projects">
          <div class="projects-header">
            <div>
              <h2 class="section-title">项目导航</h2>
              <p class="section-subtitle">所有部署在各处的小项目集合</p>
            </div>
            <div class="projects-toolbar">
              <span class="pill pill-muted">
                {{ projectCountLabel }}
              </span>
              <div class="filters">
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': activeStatus === 'all' }"
                  @click="activeStatus = 'all'"
                >
                  全部
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': activeStatus === 'online' }"
                  @click="activeStatus = 'online'"
                >
                  已上线
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': activeStatus === 'wip' }"
                  @click="activeStatus = 'wip'"
                >
                  开发中
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': activeStatus === 'archived' }"
                  @click="activeStatus = 'archived'"
                >
                  已归档
                </button>
              </div>
              <div class="filters">
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': hostFilter === 'all' }"
                  @click="hostFilter = 'all'"
                >
                  全部仓库
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': hostFilter === 'github' }"
                  @click="hostFilter = 'github'"
                >
                  GitHub
                </button>
                <button
                  type="button"
                  class="filter-pill"
                  :class="{ 'filter-pill--active': hostFilter === 'gitlab' }"
                  @click="hostFilter = 'gitlab'"
                >
                  GitLab
                </button>
              </div>
            </div>
          </div>

          <div class="groups">
            <section
              v-for="group in filteredGroups"
              :key="group.id || group.name"
              class="group"
            >
              <header class="group-header">
                <div>
                  <h3 class="group-title">
                    {{ group.name }}
                  </h3>
                  <p v-if="group.description" class="group-subtitle">
                    {{ group.description }}
                  </p>
                </div>
                <span class="pill pill-soft">
                  {{ (group.projects || []).length }} 个项目
                </span>
              </header>

              <div class="projects-grid">
                <article
                  v-for="project in group.projects"
                  :key="project.id || project.name"
                  class="project-card"
                  :class="{ 'project-card--highlight': project.highlight }"
                >
                  <div class="project-main">
                    <div class="project-title-row">
                      <h4 class="project-title">
                        {{ project.name }}
                      </h4>
                      <span
                        v-if="project.status"
                        class="status-pill"
                        :data-status="project.status"
                      >
                        {{ statusText(project.status) }}
                      </span>
                    </div>

                    <p class="project-description">
                      {{ project.description }}
                    </p>
                  </div>

                  <div class="project-footer">
                    <div
                      v-if="project.techStack && project.techStack.length"
                      class="tags"
                    >
                      <span
                        v-for="tag in project.techStack"
                        :key="tag"
                        class="tag"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <div class="project-links">
                      <a
                        v-if="project.demoUrl"
                        :href="project.demoUrl"
                        target="_blank"
                        rel="noreferrer"
                        class="btn btn-primary icon-button"
                        aria-label="在线预览"
                      >
                        <i class="ri-external-link-line btn-icon" aria-hidden="true"></i>
                        <span class="btn-label">在线预览</span>
                      </a>
                      <a
                        v-if="project.repoUrl"
                        :href="project.repoUrl"
                        target="_blank"
                        rel="noreferrer"
                        class="btn btn-ghost icon-button"
                        aria-label="代码仓库"
                      >
                        <i :class="`${repoIcon(project.repoUrl)} btn-icon`" aria-hidden="true"></i>
                        <span class="btn-label">代码仓库</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <LocalSearch v-model:open="isSearchOpen" :projects="searchItems" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
  background-color: var(--background);
  color: var(--foreground);
}

.page-inner {
  width: 100%;
  max-width: 960px;
  border-radius: 24px;
  padding: 22px 22px 26px;
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.avatar-logo {
  width: 100%;
  height: 100%;
  border-radius: 999px;
}

.title-block {
  flex: 1;
}

.title {
  margin: 0;
  font-size: 22px;
  letter-spacing: 0.02em;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
  color: var(--muted-foreground);
  cursor: pointer;
  font-size: 12px;
  transition:
    background-color 0.16s ease-out,
    border-color 0.16s ease-out,
    color 0.16s ease-out,
    transform 0.08s ease-out;
}

.search-trigger i {
  font-size: 16px;
}

.search-trigger__label {
  color: var(--foreground);
}

.search-trigger__shortcut {
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--muted-foreground);
}

.search-trigger:hover {
  border-color: var(--ring);
  color: var(--foreground);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.search-trigger:focus-visible {
  outline: 2px solid color-mix(in oklch, var(--primary) 40%, transparent);
  outline-offset: 2px;
}

.theme-toggle {
  border: 0;
  padding: 6px;
  border-radius: 50%;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.16s ease-out,
    transform 0.08s ease-out;
}

.theme-toggle:hover {
  color: var(--primary);
  transform: translateY(-1px);
}

.theme-toggle:focus-visible {
  outline: 2px solid color-mix(in oklch, var(--primary) 40%, transparent);
  outline-offset: 2px;
}

.theme-toggle-icon i {
  font-size: 19px;
  line-height: 1;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-link {
  font-size: 18px;
  padding: 4px;
  border-radius: 0;
  border: 0;
  background-color: transparent;
  color: var(--muted-foreground);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  box-shadow: none;
  transition:
    color 0.16s ease-out,
    transform 0.08s ease-out;
}

.header-link:hover {
  color: var(--primary);
  transform: translateY(-1px);
}

.header-icon {
  width: auto;
  height: auto;
  padding: 4px;
  border-radius: 0;
}

.header-icon i {
  font-size: 18px;
  line-height: 1;
}

.page-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.intro {
  padding: 12px 14px;
  border-radius: 14px;
  background-color: var(--muted);
  border: 1px solid var(--border);
}

.intro-text {
  margin: 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 16px;
}

.section-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--muted-foreground);
}

.projects-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
}

.pill-muted {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.pill-soft {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.filters {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-pill {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 3px 8px;
  font-size: 11px;
  background-color: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    background-color 0.16s ease-out,
    border-color 0.16s ease-out,
    color 0.16s ease-out;
}

.filter-pill--active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.group-title {
  margin: 0;
  padding-left: 14px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--foreground);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.group-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 18px;
  border-radius: 6px;
  background: linear-gradient(
    135deg,
    color-mix(in oklch, var(--primary) 75%, transparent),
    color-mix(in oklch, var(--accent) 70%, transparent)
  );
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--primary) 35%, transparent);
  transform: translateY(-50%);
}

.group-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted-foreground);
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-card {
  padding: 14px 14px 12px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background-color: var(--card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-xs);
  transition:
    border-color 0.16s ease-out,
    box-shadow 0.16s ease-out,
    transform 0.08s ease-out,
    background-color 0.16s ease-out;
}

.project-card--highlight {
  border-color: var(--ring);
  box-shadow: var(--shadow-lg);
}

.project-card:hover {
  border-color: var(--ring);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.project-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.project-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--card-foreground);
}

.status-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--muted-foreground);
}

.status-pill[data-status='online'] {
  background-color: color-mix(in oklch, var(--primary) 10%, transparent);
  color: var(--primary);
  border-color: color-mix(in oklch, var(--primary) 35%, var(--border));
}

.status-pill[data-status='wip'] {
  background-color: color-mix(in oklch, var(--accent) 10%, transparent);
  color: color-mix(in oklch, var(--accent-foreground) 80%, var(--foreground));
  border-color: color-mix(in oklch, var(--accent) 35%, var(--border));
}

.status-pill[data-status='archived'] {
  background-color: transparent;
  color: var(--muted-foreground);
  border-style: dashed;
}

.project-description {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
}

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  transition:
    border-color 0.16s ease-out,
    background-color 0.16s ease-out,
    color 0.16s ease-out,
    box-shadow 0.16s ease-out,
    transform 0.08s ease-out;
}

.icon-button {
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  transition:
    border-radius 0.2s ease,
    padding 0.2s ease;
}

.btn-icon {
  font-size: 16px;
  line-height: 1;
}

.btn-label {
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  margin-left: 0;
  transform: translateY(2px);
  overflow: hidden;
  transition:
    max-width 0.28s ease,
    opacity 0.2s ease,
    margin-left 0.2s ease,
    transform 0.2s ease;
}

.icon-button:hover .btn-label,
.icon-button:focus-visible .btn-label {
  max-width: 140px;
  opacity: 1;
  margin-left: 6px;
  transform: translateY(0);
}

.icon-button:hover,
.icon-button:focus-visible {
  border-radius: 30px;
  padding: 9px 12px;
}

.icon-button:focus-visible {
  outline: 2px solid color-mix(in oklch, var(--primary) 40%, transparent);
  outline-offset: 2px;
}

.btn-primary {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.btn-ghost {
  background-color: var(--secondary);
  border-color: var(--border);
  color: var(--secondary-foreground);
}

.btn-ghost:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .page {
    padding: 16px 10px;
  }

  .page-inner {
    padding: 18px 14px 22px;
    border-radius: 20px;
  }

  .page-header {
    align-items: flex-start;
  }

  .projects-toolbar {
    flex-direction: column;
    align-items: flex-end;
  }

  .filters {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .project-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
