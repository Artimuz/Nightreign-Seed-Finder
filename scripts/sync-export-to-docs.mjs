import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'out')
const targetRoot = path.join(projectRoot, 'docs')

const preservedTargetRelativePaths = new Set(['.nojekyll'])

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

const relativeFrom = (rootDir, filePath) => path.relative(rootDir, filePath).split(path.sep).join('/')

const copyFileIfChanged = async (sourceFilePath, targetFilePath) => {
  const targetDir = path.dirname(targetFilePath)
  await ensureDir(targetDir)

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

const shouldPreserveRelativePath = (relativePath) => preservedTargetRelativePaths.has(relativePath)

const removeStaleTargets = async (sourceRelativeSet) => {
  if (!(await pathExists(targetRoot))) return

  const targetFiles = await listFilesRecursive(targetRoot)
  for (const targetFilePath of targetFiles) {
    const rel = relativeFrom(targetRoot, targetFilePath)
    if (shouldPreserveRelativePath(rel)) continue
    if (!sourceRelativeSet.has(rel)) {
      await fs.unlink(targetFilePath)
    }
  }
}

const removeEmptyDirs = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    await removeEmptyDirs(path.join(dirPath, entry.name))
  }

  const afterEntries = await fs.readdir(dirPath)
  if (afterEntries.length === 0) {
    await fs.rmdir(dirPath)
  }
}

const ensureNoJekyll = async () => {
  const filePath = path.join(targetRoot, '.nojekyll')
  if (await pathExists(filePath)) return
  await ensureDir(targetRoot)
  await fs.writeFile(filePath, '')
}

const main = async () => {
  if (!(await pathExists(sourceRoot))) {
    throw new Error('out folder not found. Run next build first.')
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

  await removeStaleTargets(sourceRelativeSet)
  await removeEmptyDirs(targetRoot)
  await ensureNoJekyll()
}

await main()
