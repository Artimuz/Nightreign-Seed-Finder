import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()

const docsRoot = path.join(projectRoot, 'docs')
const publicSourceRoot = path.join(projectRoot, 'public')
const publicTargetRoot = path.join(docsRoot, 'public')

const nextStaticSourceRoot = path.join(projectRoot, '.next', 'static')
const chunksTargetRoot = path.join(docsRoot, 'chunks', '_next', 'static')

const CHUNKS_SIZE_LIMIT_BYTES = 50 * 1024 * 1024

const sha256 = async (filePath) => {
  const content = await fs.readFile(filePath)
  return createHash('sha256').update(content).digest('hex')
}

const pathExists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true })
}

const listFilesRecursive = async (rootDir) => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath)))
      continue
    }
    if (entry.isFile()) files.push(fullPath)
  }

  return files
}

const listDirsRecursive = async (rootDir) => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const dirs = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const fullPath = path.join(rootDir, entry.name)
    dirs.push(fullPath)
    dirs.push(...(await listDirsRecursive(fullPath)))
  }

  return dirs
}

const relativeFrom = (rootDir, filePath) => path.relative(rootDir, filePath).split(path.sep).join('/')

const copyFileIfChanged = async (sourceFilePath, targetFilePath) => {
  await ensureDir(path.dirname(targetFilePath))

  const targetExists = await pathExists(targetFilePath)
  if (!targetExists) {
    await fs.copyFile(sourceFilePath, targetFilePath)
    return
  }

  const [sourceHash, targetHash] = await Promise.all([sha256(sourceFilePath), sha256(targetFilePath)])
  if (sourceHash !== targetHash) {
    await fs.copyFile(sourceFilePath, targetFilePath)
  }
}

const removeStaleTargets = async (targetRoot, preservedRelativePaths, sourceRelativeSet) => {
  if (!(await pathExists(targetRoot))) return

  const targetFiles = await listFilesRecursive(targetRoot)
  for (const targetFilePath of targetFiles) {
    const rel = relativeFrom(targetRoot, targetFilePath)
    if (preservedRelativePaths.has(rel)) continue
    if (!sourceRelativeSet.has(rel)) {
      await fs.unlink(targetFilePath)
    }
  }
}

const removeEmptyDirs = async (rootDir) => {
  if (!(await pathExists(rootDir))) return

  const dirs = await listDirsRecursive(rootDir)
  const sorted = dirs.sort((a, b) => b.length - a.length)

  for (const dirPath of sorted) {
    const entries = await fs.readdir(dirPath)
    if (entries.length === 0) {
      await fs.rmdir(dirPath)
    }
  }
}

const syncFolder = async ({ sourceRoot, targetRoot, preservedRelativePaths }) => {
  if (!(await pathExists(sourceRoot))) {
    return
  }

  await ensureDir(targetRoot)

  const sourceFiles = await listFilesRecursive(sourceRoot)
  const relativePaths = sourceFiles.map((filePath) => relativeFrom(sourceRoot, filePath))
  const sourceRelativeSet = new Set(relativePaths)

  await Promise.all(
    sourceFiles.map(async (sourceFilePath) => {
      const rel = relativeFrom(sourceRoot, sourceFilePath)
      const targetFilePath = path.join(targetRoot, rel.split('/').join(path.sep))
      await copyFileIfChanged(sourceFilePath, targetFilePath)
    })
  )

  await removeStaleTargets(targetRoot, preservedRelativePaths, sourceRelativeSet)
  await removeEmptyDirs(targetRoot)
}

const enforceSizeLimit = async (rootDir, maxBytes) => {
  if (!(await pathExists(rootDir))) return

  const files = await listFilesRecursive(rootDir)
  const items = await Promise.all(
    files.map(async (filePath) => {
      const stat = await fs.stat(filePath)
      return { filePath, size: stat.size, mtimeMs: stat.mtimeMs }
    })
  )

  let total = items.reduce((sum, item) => sum + item.size, 0)
  if (total <= maxBytes) {
    return
  }

  const sortedOldestFirst = items.sort((a, b) => a.mtimeMs - b.mtimeMs)

  for (const item of sortedOldestFirst) {
    if (total <= maxBytes) break
    await fs.unlink(item.filePath)
    total -= item.size
  }

  await removeEmptyDirs(rootDir)
}

const ensureDocsRootFiles = async () => {
  await ensureDir(docsRoot)

  const nojekyllPath = path.join(docsRoot, '.nojekyll')
  if (!(await pathExists(nojekyllPath))) {
    await fs.writeFile(nojekyllPath, '')
  }

  const indexHtmlPath = path.join(docsRoot, 'index.html')
  if (!(await pathExists(indexHtmlPath))) {
    await fs.writeFile(
      indexHtmlPath,
      '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"></head><body></body></html>\n'
    )
  }
}

const removeLegacyDocsRootEntries = async () => {
  if (!(await pathExists(docsRoot))) return

  const preserved = new Set(['.nojekyll', 'index.html', 'public', 'chunks'])
  const entries = await fs.readdir(docsRoot, { withFileTypes: true })

  await Promise.all(
    entries
      .filter((entry) => !preserved.has(entry.name))
      .map(async (entry) => {
        const fullPath = path.join(docsRoot, entry.name)
        await fs.rm(fullPath, { recursive: true, force: true })
      })
  )
}

const main = async () => {
  await ensureDocsRootFiles()
  await removeLegacyDocsRootEntries()

  await syncFolder({
    sourceRoot: publicSourceRoot,
    targetRoot: publicTargetRoot,
    preservedRelativePaths: new Set(),
  })

  await syncFolder({
    sourceRoot: nextStaticSourceRoot,
    targetRoot: chunksTargetRoot,
    preservedRelativePaths: new Set(),
  })

  await enforceSizeLimit(path.join(docsRoot, 'chunks'), CHUNKS_SIZE_LIMIT_BYTES)
}

await main()
