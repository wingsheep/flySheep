<script setup>
import { computed, ref, watchEffect, onMounted } from 'vue'
import { siteConfig, projectGroups } from './config/projects'

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

const activeStatus = ref('all')

const filteredGroups = computed(() => {
  return projectGroups
    .map((group) => {
      const projects =
        group.projects?.filter((project) => {
          if (activeStatus.value === 'all') return true
          return project.status === activeStatus.value
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
</script>

<template>
  <div class="page">
    <div class="page-inner">
      <header class="page-header">
        <div class="avatar">
          <span>S</span>
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
            class="theme-toggle"
            :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
            @click="toggleTheme"
          >
            <span class="theme-toggle-track">
              <span
                class="theme-toggle-thumb"
                :class="{ 'theme-toggle-thumb--dark': theme === 'dark' }"
              />
            </span>
          </button>

          <div class="header-links" v-if="siteConfig.links">
            <a
              v-if="siteConfig.links.github"
              :href="siteConfig.links.github"
              target="_blank"
              rel="noreferrer"
              class="header-link"
            >
              GitHub
            </a>
            <a
              v-if="siteConfig.links.blog"
              :href="siteConfig.links.blog"
              target="_blank"
              rel="noreferrer"
              class="header-link"
            >
              Blog
            </a>
          </div>
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
                        class="btn btn-primary"
                      >
                        在线预览
                      </a>
                      <a
                        v-if="project.repoUrl"
                        :href="project.repoUrl"
                        target="_blank"
                        rel="noreferrer"
                        class="btn btn-ghost"
                      >
                        代码仓库
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
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-foreground);
  font-weight: 700;
  font-size: 18px;
  box-shadow: var(--shadow-lg);
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

.theme-toggle {
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
}

.theme-toggle-track {
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background-color: var(--muted);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 2px;
  box-shadow: var(--shadow-sm);
  transition:
    background-color 0.16s ease-out,
    border-color 0.16s ease-out,
    box-shadow 0.16s ease-out;
}

.theme-toggle-thumb {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background-color: var(--background);
  box-shadow: 0 1px 2px hsl(0 0% 0% / 0.18);
  transform: translateX(0);
  transition:
    transform 0.16s ease-out,
    background-color 0.16s ease-out;
}

.theme-toggle-thumb--dark {
  transform: translateX(12px);
  background-color: var(--primary);
}

.header-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-link {
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-sm);
  transition:
    border-color 0.16s ease-out,
    background-color 0.16s ease-out,
    transform 0.08s ease-out,
    box-shadow 0.12s ease-out;
}

.header-link:hover {
  border-color: var(--ring);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
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
  font-size: 15px;
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
  font-size: 14px;
}

.status-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.status-pill[data-status='online'] {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.status-pill[data-status='wip'] {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.status-pill[data-status='archived'] {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
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
  gap: 6px;
  transition:
    border-color 0.16s ease-out,
    background-color 0.16s ease-out,
    color 0.16s ease-out,
    box-shadow 0.16s ease-out,
    transform 0.08s ease-out;
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

