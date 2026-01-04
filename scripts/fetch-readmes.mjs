import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { projectGroups } from '../src/config/projects.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../public/readmes.json')
const skipInternal =
  process.env.NETLIFY === 'true' || process.env.SKIP_INTERNAL_READMES === '1'
const internalHosts = (process.env.INTERNAL_README_HOSTS || 'git.hgj.net')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const normalizeRepoUrl = (url) => {
  if (!url) return ''
  return url
    .split('#')[0]
    .replace(/\.git$/, '')
    .replace(/\/(?:-\/)?tree\/.+$/, '')
    .replace(/\/(?:-\/)?blob\/.+$/, '')
    .replace(/\/$/, '')
}

const extractBranchHint = (url) => {
  if (!url) return ''
  const match = url.match(/\/(?:-\/)?(?:tree|blob)\/([^/]+)/)
  return match ? match[1] : ''
}

const uniqueList = (list) => [...new Set(list.filter(Boolean))]

const buildReadmeCandidates = (url) => {
  const normalized = normalizeRepoUrl(url)
  if (!normalized) return []
  const branchHint = extractBranchHint(url)
  const fileCandidates = ['README.md', 'README.MD', 'readme.md', 'README.txt', 'README']

  if (normalized.includes('github.com')) {
    const match = normalized.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return []
    const owner = match[1]
    const repo = match[2]
    const base = `https://raw.githubusercontent.com/${owner}/${repo}`
    const branches = uniqueList([branchHint, 'HEAD', 'main', 'master'])
    return branches.flatMap((branch) =>
      fileCandidates.map((file) => `${base}/${branch}/${file}`),
    )
  }

  try {
    const target = new URL(normalized)
    const base = `${target.origin}${target.pathname}`
    const branches = uniqueList([branchHint, 'master', 'main'])
    return branches.flatMap((branch) =>
      fileCandidates.map((file) => `${base}/raw/${branch}/${file}`),
    )
  } catch {
    return []
  }
}

const getProjectKey = (project) => project?.id || project?.name

const isInternalHost = (url) => {
  if (!url) return false
  try {
    const hostname = new URL(url).hostname
    return internalHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

const fetchReadme = async (url) => {
  const response = await fetch(url)
  if (!response.ok) return ''
  return response.text()
}

let existing = {}
try {
  const raw = await readFile(outputPath, 'utf8')
  existing = JSON.parse(raw)
} catch {
  existing = {}
}

const readmes = { ...existing }
const failures = []
const skipped = []

for (const group of projectGroups || []) {
  for (const project of group.projects || []) {
    const key = getProjectKey(project)
    if (!key || !project.repoUrl) continue
    if (skipInternal && isInternalHost(project.repoUrl)) {
      skipped.push(key)
      continue
    }
    const candidates = buildReadmeCandidates(project.repoUrl)
    let found = false

    for (const candidate of candidates) {
      try {
        const text = await fetchReadme(candidate)
        if (!text || !text.trim()) continue
        readmes[key] = {
          raw: text,
          source: candidate,
        }
        found = true
        break
      } catch {
        // Skip invalid candidate and continue to next.
      }
    }

    if (!found) {
      failures.push(key)
    }
  }
}

await writeFile(outputPath, `${JSON.stringify(readmes, null, 2)}\n`, 'utf8')

const summary = [
  `readmes: ${Object.keys(readmes).length}`,
  `failures: ${failures.length}`,
  `skipped: ${skipped.length}`,
]
console.log(`[readme] ${summary.join(' | ')}`)
