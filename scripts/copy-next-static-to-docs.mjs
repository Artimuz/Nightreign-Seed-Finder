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

const copyDir = async (fromDir, toDir) => {
  await ensureDir(toDir)
  const entries = await fs.readdir(fromDir, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      const fromPath = path.join(fromDir, entry.name)
      const toPath = path.join(toDir, entry.name)

      if (entry.isDirectory()) {
        await copyDir(fromPath, toPath)
        return
      }

      await fs.copyFile(fromPath, toPath)
    })
  )
}

const main = async () => {
  if (!(await pathExists(sourceRoot))) return

  await copyDir(sourceRoot, targetRoot)
}

await main()
