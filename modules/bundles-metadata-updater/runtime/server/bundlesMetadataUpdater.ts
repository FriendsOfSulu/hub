import { promises as fs } from 'node:fs'
import path from 'node:path'

import fg from 'fast-glob'
import matter from 'gray-matter'

export interface BundlesMetadataUpdaterOptions {
  /**
   * Project root directory that contains the `content/bundles` directory.
   * Defaults to the current working directory.
   */
  rootDir?: string
  /**
   * Force a refresh even if the `.timestamp` file is considered fresh.
   */
  force?: boolean
  /**
   * Maximum age of cached data in milliseconds. Defaults to 24 hours.
   */
  maxAgeMs?: number
  /**
   * Optional logger, defaults to a no-op.
   */
  logger?: (message: string) => void
}

export interface BundlesMetadataUpdaterResult {
  skipped: boolean
  total: number
  updated: number
  errors: Array<{ file: string, message: string }>
}

interface GithubMeta {
  stars?: number
  avatarUrl?: string
  defaultBranch?: string
  lastUpdatedAt?: string
}

interface PackagistMeta {
  totalDownloads?: number
}

interface ComposerMeta {
  targetSuluVersion?: string
}

type FrontMatter = Record<string, any>

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export async function runBundlesMetadataUpdater(
  options: BundlesMetadataUpdaterOptions = {}
): Promise<BundlesMetadataUpdaterResult> {
  const rootDir = options.rootDir ?? process.cwd()
  const logger = options.logger ?? (() => {})
  const maxAgeMs = options.maxAgeMs ?? ONE_DAY_MS

  const bundlesDir = path.resolve(rootDir, 'content', 'bundles')
  const timestampPath = path.join(bundlesDir, '.timestamp')
  const now = new Date()

  const fresh = await isTimestampFresh(timestampPath, now, maxAgeMs)
  if (fresh && !options.force) {
    logger('bundles-metadata-updater: timestamp is fresh, skipping update')
    return {
      skipped: true,
      total: 0,
      updated: 0,
      errors: []
    }
  }

  const bundleFiles = await fg('**/*.md', {
    cwd: bundlesDir,
    absolute: true
  })

  let updated = 0
  const errors: Array<{ file: string, message: string }> = []

  for (const filePath of bundleFiles) {
    try {
      const changed = await updateSingleBundleFile(filePath, logger)
      if (changed) {
        updated += 1
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push({ file: filePath, message })
      logger(
        `bundles-metadata-updater: failed to update ${filePath}: ${message}`
      )
    }
  }

  await writeTimestamp(timestampPath, now)

  return {
    skipped: false,
    total: bundleFiles.length,
    updated,
    errors
  }
}

async function isTimestampFresh(
  timestampPath: string,
  now: Date,
  maxAgeMs: number
): Promise<boolean> {
  try {
    const raw = await fs.readFile(timestampPath, 'utf8')
    const trimmed = raw.trim()

    let lastRun: Date | null = null

    const numeric = Number.parseInt(trimmed, 10)
    if (Number.isFinite(numeric)) {
      lastRun = new Date(numeric)
    } else {
      const parsed = new Date(trimmed)
      if (!Number.isNaN(parsed.getTime())) {
        lastRun = parsed
      }
    }

    if (!lastRun) {
      return false
    }

    return now.getTime() - lastRun.getTime() < maxAgeMs
  } catch (error: any) {
    if (error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }
    return false
  }
}

async function writeTimestamp(timestampPath: string, now: Date): Promise<void> {
  await fs.mkdir(path.dirname(timestampPath), { recursive: true })
  await fs.writeFile(timestampPath, String(now.getTime()), 'utf8')
}

async function updateSingleBundleFile(
  filePath: string,
  logger: (message: string) => void
): Promise<boolean> {
  const source = await fs.readFile(filePath, 'utf8')
  const parsed = matter(source)
  const frontMatter = parsed.data as FrontMatter

  const githubLink
    = typeof frontMatter.githubLink === 'string' ? frontMatter.githubLink : null
  const packageName
    = typeof frontMatter.packageName === 'string'
      ? frontMatter.packageName
      : null

  if (!githubLink || !packageName) {
    logger(
      `bundles-metadata-updater: skipping ${filePath} (missing githubLink or packageName in front matter)`
    )
    return false
  }

  const githubRepo = parseGithubLink(githubLink)
  if (!githubRepo) {
    logger(
      `bundles-metadata-updater: could not parse GitHub link "${githubLink}" for ${filePath}`
    )
    return false
  }

  const token = process.env.GITHUB_TOKEN

  const [githubMeta, packagistMeta, composerMeta] = await Promise.all([
    fetchGithubMeta(githubRepo.owner, githubRepo.repo, token),
    getPackageDownloadStats(packageName),
    fetchComposerMeta(githubRepo.owner, githubRepo.repo, token)
  ])

  const updatedFrontMatter = mergeFrontMatter(frontMatter, {
    githubMeta,
    packagistMeta,
    composerMeta
  })

  const next = matter.stringify(parsed.content, updatedFrontMatter)

  if (next === source) {
    logger(`bundles-metadata-updater: no changes for ${filePath}`)
    return false
  }

  await fs.writeFile(filePath, next, 'utf8')
  logger(`bundles-metadata-updater: updated ${filePath}`)

  return true
}

function parseGithubLink(url: string): { owner: string, repo: string } | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('github.com')) {
      return null
    }

    const [owner, repo] = parsed.pathname.replace(/^\/+/, '').split('/')

    if (!owner || !repo) {
      return null
    }

    return { owner, repo: repo.replace(/\.git$/, '') }
  } catch {
    return null
  }
}

async function fetchGithubMeta(
  owner: string,
  repo: string,
  token?: string
): Promise<GithubMeta> {
  const headers: Record<string, string> = {
    'User-Agent': 'bundles-metadata-updater',
    'Accept': 'application/vnd.github+json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`
  const repoResponse = await safeFetchJson(repoUrl, headers)

  if (!repoResponse.ok || !repoResponse.data) {
    return {}
  }

  const repoData = repoResponse.data as any

  const meta: GithubMeta = {
    stars:
      typeof repoData.stargazers_count === 'number'
        ? repoData.stargazers_count
        : undefined,
    avatarUrl:
      repoData.owner && typeof repoData.owner.avatar_url === 'string'
        ? repoData.owner.avatar_url
        : undefined,
    defaultBranch:
      typeof repoData.default_branch === 'string'
        ? repoData.default_branch
        : undefined,
    lastUpdatedAt:
      typeof repoData.pushed_at === 'string'
        ? repoData.pushed_at
        : typeof repoData.updated_at === 'string'
          ? repoData.updated_at
          : undefined
  }

  return meta
}

async function fetchComposerMeta(
  owner: string,
  repo: string,
  token?: string
): Promise<ComposerMeta> {
  const headers: Record<string, string> = {
    'User-Agent': 'bundles-metadata-updater',
    'Accept': 'application/vnd.github.raw+json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`
  const repoResponse = await safeFetchJson(repoUrl, headers)

  if (!repoResponse.ok || !repoResponse.data) {
    return {}
  }

  const repoData = repoResponse.data as any
  const defaultBranch
    = typeof repoData.default_branch === 'string'
      ? repoData.default_branch
      : 'main'

  const composerUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/composer.json`
  const composerResponse = await safeFetchText(composerUrl, headers)

  if (!composerResponse.ok || !composerResponse.data) {
    return {}
  }

  try {
    const composer = JSON.parse(composerResponse.data) as any
    const requireField = composer.require as Record<string, string> | undefined
    if (!requireField) {
      return {}
    }

    const suluKeys = Object.keys(requireField).filter(key =>
      key.startsWith('sulu/')
    )
    if (suluKeys.length === 0) {
      return {}
    }

    const primaryKey
      = suluKeys.find(key => key === 'sulu/sulu')
        ?? suluKeys.find(key => key === 'sulu/sulu-minimal')
        ?? suluKeys[0]

    const version = primaryKey ? requireField[primaryKey] : undefined
    if (typeof version !== 'string') {
      return {}
    }

    return {
      targetSuluVersion: version
    }
  } catch {
    return {}
  }
}

async function getPackageDownloadStats(
  packageName: string
): Promise<PackagistMeta> {
  const url = `https://packagist.org/packages/${encodeURIComponent(packageName)}/stats.json`
  const response = await safeFetchJson(url, {
    'User-Agent': 'bundles-metadata-updater (mailto:you@example.com)'
  })

  if (!response.ok || !response.data) {
    return {}
  }

  const data = response.data as any
  const downloads = data.downloads

  if (!downloads || typeof downloads.total !== 'number') {
    return {}
  }

  return {
    totalDownloads: downloads.total
  }
}

async function safeFetchJson(
  url: string,
  headers: Record<string, string>
): Promise<{ ok: boolean, data: unknown | null }> {
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      return { ok: false, data: null }
    }
    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, data: null }
  }
}

async function safeFetchText(
  url: string,
  headers: Record<string, string>
): Promise<{ ok: boolean, data: string | null }> {
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      return { ok: false, data: null }
    }
    const data = await response.text()
    return { ok: true, data }
  } catch {
    return { ok: false, data: null }
  }
}

function mergeFrontMatter(
  original: FrontMatter,
  sources: {
    githubMeta: GithubMeta
    packagistMeta: PackagistMeta
    composerMeta: ComposerMeta
  }
): FrontMatter {
  const preferredOrder = [
    'title',
    'packageName',
    'shortDescription',
    'license',
    'githubMaintainer',
    'githubLink',
    'githubAvatar',
    'githubStars',
    'totalDownloads',
    'targetSuluVersion',
    'lastRepositoryUpdate',
    'categories'
  ]

  const dynamicValues: Partial<FrontMatter> = {
    githubAvatar: sources.githubMeta.avatarUrl ?? original.githubAvatar,
    githubStars: sources.githubMeta.stars ?? original.githubStars,
    totalDownloads:
      sources.packagistMeta.totalDownloads ?? original.totalDownloads,
    targetSuluVersion:
      sources.composerMeta.targetSuluVersion ?? original.targetSuluVersion,
    lastRepositoryUpdate:
      sources.githubMeta.lastUpdatedAt ?? original.lastRepositoryUpdate
  }

  const result: FrontMatter = {}

  for (const key of preferredOrder) {
    if (
      key in dynamicValues
      && dynamicValues[key as keyof typeof dynamicValues] !== undefined
    ) {
      result[key] = dynamicValues[key as keyof typeof dynamicValues]
    } else if (key in original) {
      result[key] = original[key]
    }
  }

  for (const [key, value] of Object.entries(original)) {
    if (!(key in result)) {
      result[key] = value
    }
  }

  return result
}
