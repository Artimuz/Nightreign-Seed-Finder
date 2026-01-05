import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

const contentTypeFor = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.png') return 'image/png'
  if (ext === '.ico') return 'image/x-icon'
  if (ext === '.json') return 'application/json; charset=utf-8'
  if (ext === '.svg') return 'image/svg+xml; charset=utf-8'
  if (ext === '.webm') return 'video/webm'
  if (ext === '.otf') return 'font/otf'
  return 'application/octet-stream'
}

const isAllowedPath = (value: string): boolean => {
  const normalized = value.replace(/\\/g, '/')
  if (normalized.includes('..')) return false
  return true
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

  const { path: parts } = await context.params
  const relativePath = parts.join('/')

  if (!isAllowedPath(relativePath)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  const docsRoot = path.join(process.cwd(), 'docs')
  const absolutePath = path.join(docsRoot, relativePath)

  try {
    const fileBuffer = await fs.readFile(absolutePath)
    const body = new Uint8Array(fileBuffer)
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentTypeFor(absolutePath),
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
