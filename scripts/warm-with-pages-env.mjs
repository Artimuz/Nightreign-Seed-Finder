import { spawn } from 'node:child_process'

const requireEnv = (name) => {
  const value = String(process.env[name] || '').trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

requireEnv('NEXT_PUBLIC_PAGES_BASE_URL')
requireEnv('NEXT_PUBLIC_PAGES_PUBLIC_BASE_URL')

const disable = String(process.env.NEXT_PUBLIC_DISABLE_PAGES_CHUNKS || '').trim()
if (disable !== 'true' && disable !== 'false' && disable !== '') {
  throw new Error('NEXT_PUBLIC_DISABLE_PAGES_CHUNKS must be true or false when set')
}

const env = {
  ...process.env,
  NEXT_PUBLIC_DISABLE_PAGES_CHUNKS: disable || 'false',
}

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env, shell: process.platform === 'win32' })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`))
    })
    child.on('error', reject)
  })

const main = async () => {
  await run('npm', ['run', 'build:ci'])
  await run('npm', ['run', 'pages:prepare'])
}

await main()
