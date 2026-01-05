import { spawn } from 'node:child_process'

const env = {
  ...process.env,
  NEXT_PUBLIC_DISABLE_PAGES_CHUNKS: 'false',
}

const nextPublicPagesBaseUrl = (process.env.NEXT_PUBLIC_PAGES_BASE_URL || '').trim()
const nextPublicPagesPublicBaseUrl = (process.env.NEXT_PUBLIC_PAGES_PUBLIC_BASE_URL || '').trim()

if (!nextPublicPagesBaseUrl) {
  throw new Error('NEXT_PUBLIC_PAGES_BASE_URL is required')
}

if (!nextPublicPagesPublicBaseUrl) {
  throw new Error('NEXT_PUBLIC_PAGES_PUBLIC_BASE_URL is required')
}

const child = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
