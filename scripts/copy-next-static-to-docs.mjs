import { promises as fs } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, '.next', 'static')
const targetRoot = path.join(projectRoot, 'docs', '_next', 'static')

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

const main = async () => {
  if (!(await pathExists(sourceRoot))) {
    throw new Error('Next static output not found')
  }

  await fs.rm(targetRoot, { recursive: true, force: true })
  await ensureDir(targetRoot)

  const sourceFiles = await listFilesRecursive(sourceRoot)

  await Promise.all(
    sourceFiles.map(async (sourceFilePath) => {
      const rel = relativeFrom(sourceRoot, sourceFilePath)
      const targetFilePath = path.join(targetRoot, rel.split('/').join(path.sep))
      await ensureDir(path.dirname(targetFilePath))
      await fs.copyFile(sourceFilePath, targetFilePath)
    })
  )
}

await main()
