<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onBeforeUpdate,
  ref,
  watch,
} from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  projects: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '搜索项目、描述或技术栈…',
  },
})

const emit = defineEmits(['update:open'])

const query = ref('')
const activeIndex = ref(0)
const searchInput = ref(null)
const bodyOriginalOverflow = ref('')
const resultRefs = ref([])

onBeforeUpdate(() => {
  resultRefs.value = []
})

const weightedProjects = computed(() =>
  (props.projects || []).map((project) => {
    const haystack = [
      project.name,
      project.description,
      project.groupName,
      (project.techStack || []).join(' '),
      project.status,
      project.statusLabel,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return {
      ...project,
      haystack,
    }
  }),
)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = weightedProjects.value

  if (!q) {
    return list.slice(0, 8)
  }

  return list
    .map((project) => {
      let weight = 0
      if (project.name?.toLowerCase().includes(q)) weight += 3
      if (project.groupName?.toLowerCase().includes(q)) weight += 2
      if (project.description?.toLowerCase().includes(q)) weight += 2
      if (project.techStack?.some((tag) => tag.toLowerCase().includes(q)))
        weight += 1
      if (project.status?.toLowerCase().includes(q)) weight += 1
      if (project.statusLabel?.toLowerCase().includes(q)) weight += 1
      if (project.haystack.includes(q)) weight += 1

      return {
        project,
        weight,
      }
    })
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.project)
})

const metaKeyLabel = computed(() => {
  if (typeof navigator === 'undefined') return 'Ctrl'
  return navigator.platform?.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'
})

const close = () => {
  emit('update:open', false)
}

const openDialog = () => {
  emit('update:open', true)
}

defineExpose({ open: openDialog, close })

watch(
  () => props.open,
  async (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      bodyOriginalOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      await nextTick()
      searchInput.value?.focus()
    } else {
      document.body.style.overflow = bodyOriginalOverflow.value
      query.value = ''
      activeIndex.value = 0
    }
  },
)

watch(
  results,
  () => {
    activeIndex.value = 0
    nextTick(scrollActiveIntoView)
  },
  { flush: 'post' },
)

watch(activeIndex, () => {
  nextTick(scrollActiveIntoView)
})

const select = (project) => {
  const target = project.demoUrl || project.repoUrl
  if (target) {
    window.open(target, '_blank', 'noopener')
  }
  close()
}

const repoIcon = (url) => (url && url.includes('github.com') ? 'ri-github-line' : 'ri-gitlab-line')

const onKeydown = (event) => {
  if (!props.open) return
  const total = results.value.length
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (total === 0) return
    activeIndex.value = (activeIndex.value + 1) % total
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (total === 0) return
    activeIndex.value = (activeIndex.value - 1 + total) % total
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const project = results.value[activeIndex.value]
    if (project) {
      select(project)
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

const handleGlobalShortcut = (event) => {
  const key = event.key?.toLowerCase()
  if ((event.metaKey || event.ctrlKey) && key === 'k') {
    event.preventDefault()
    openDialog()
  }
}

const scrollActiveIntoView = () => {
  const el = resultRefs.value[activeIndex.value]
  if (el?.scrollIntoView) {
    el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOriginalOverflow.value
  }
})
</script>

<template>
  <teleport to="body">
    <div
      v-if="open"
      class="search-layer"
      role="dialog"
      aria-modal="true"
      aria-label="搜索项目"
      @click.self="close"
    >
      <div class="search-dialog" @keydown.stop="onKeydown">
        <div class="search-input-row">
          <div class="search-icon">
            <i class="ri-search-line" aria-hidden="true"></i>
          </div>
          <input
            ref="searchInput"
            v-model="query"
            :placeholder="placeholder"
            class="search-input"
            type="text"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="search-close" type="button" aria-label="关闭搜索" @click="close">
            <i class="ri-close-line" aria-hidden="true"></i>
          </button>
        </div>

        <div class="search-meta">
          <span v-if="query">找到 {{ results.length }} 个结果</span>
          <span v-else>试试项目名称、描述或技术栈关键字</span>
        </div>

        <div class="search-results" role="listbox">
          <div v-if="results.length === 0" class="search-empty">暂无匹配结果</div>
          <button
            v-for="(project, index) in results"
            :key="project.id || project.name"
            class="search-result"
            :class="{ 'search-result--active': index === activeIndex }"
            :ref="(el) => el && resultRefs.push(el)"
            role="option"
            type="button"
            @click="select(project)"
            @mouseover="activeIndex = index"
          >
            <div class="result-main">
              <div class="result-title-row">
                <span class="result-title">{{ project.name }}</span>
                <span v-if="project.status" class="result-status" :data-status="project.status">
                  {{ project.statusLabel || project.status }}
                </span>
              </div>
              <p class="result-desc">
                {{ project.description }}
              </p>
              <div class="result-tags" v-if="project.techStack?.length">
                <span v-for="tag in project.techStack" :key="tag" class="result-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="result-meta">
              <span class="result-group">{{ project.groupName }}</span>
              <span class="result-link-type">
                <i
                  :class="project.demoUrl ? 'ri-external-link-line' : repoIcon(project.repoUrl)"
                  aria-hidden="true"
                ></i>
              </span>
            </div>
          </button>
        </div>

        <div class="search-hints">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>Enter</kbd> 打开</span>
          <span><kbd>Esc</kbd> 关闭</span>
          <span><kbd>{{ metaKeyLabel }}</kbd>+<kbd>K</kbd> 再次打开</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.search-layer {
  position: fixed;
  inset: 0;
  background: color-mix(in oklch, var(--background) 40%, rgba(0, 0, 0, 0.45));
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 64px 16px 24px;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.search-dialog {
  width: min(720px, 100%);
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-2xl);
  padding: 14px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
}

.search-icon {
  color: var(--muted-foreground);
  display: inline-flex;
  align-items: center;
}

.search-icon i {
  font-size: 18px;
}

.search-input {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--input);
  font-size: 14px;
  outline: none;
}

.search-close {
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.search-close:hover {
  color: var(--foreground);
  background-color: color-mix(in oklch, var(--primary) 12%, transparent);
}

.search-meta {
  font-size: 12px;
  color: var(--muted-foreground);
  padding: 0 4px;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 420px;
  overflow-y: auto;
  padding: 2px 2px 6px;
}

.search-empty {
  padding: 16px 12px;
  font-size: 13px;
  color: var(--muted-foreground);
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 12px;
}

.search-result {
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--card-foreground);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.08s ease;
}

.search-result:hover {
  border-color: var(--ring);
  background-color: color-mix(in oklch, var(--primary) 12%, var(--card));
  transform: translateY(-1px);
}

.search-result--active {
  border-color: var(--ring);
  background-color: color-mix(in oklch, var(--primary) 16%, var(--card));
  box-shadow: var(--shadow-lg);
}

.result-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
}

.result-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid var(--border);
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.result-status[data-status='online'] {
  border-color: color-mix(in oklch, var(--primary) 35%, var(--border));
  color: var(--primary);
}

.result-status[data-status='wip'] {
  border-color: color-mix(in oklch, var(--accent) 35%, var(--border));
  color: color-mix(in oklch, var(--accent-foreground) 80%, var(--foreground));
}

.result-status[data-status='archived'] {
  border-style: dashed;
}

.result-desc {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
}

.result-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.result-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted-foreground);
  flex-shrink: 0;
}

.result-group {
  padding: 4px 8px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.result-link-type {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.result-link-type i {
  font-size: 15px;
}

.search-hints {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--muted-foreground);
  padding: 8px 6px 2px;
  flex-wrap: wrap;
}

kbd {
  display: inline-block;
  min-width: 18px;
  padding: 3px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--secondary);
  box-shadow: var(--shadow-2xs);
  font-size: 11px;
  line-height: 1;
  text-align: center;
}

@media (max-width: 640px) {
  .search-layer {
    padding: 24px 10px;
  }

  .search-dialog {
    padding: 12px;
  }

  .search-result {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
