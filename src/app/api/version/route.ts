import { NextResponse } from 'next/server'
import packageJson from '../../../../package.json'
export const runtime = 'edge'
const APP_VERSION = packageJson.version
const VERSION_HISTORY = [
  { version: '1.1.0', released: '2024-01-20', features: ['Vercel deployment fixes', 'Runtime configuration updates'] },
  { version: '1.0.15', released: '2024-01-20', features: ['Hourly version checking', 'Update notifications', 'Admin dashboard'] },
  { version: '1.0.14', released: '2024-01-20', features: ['Comment cleanup', 'Code optimization'] },
  { version: '1.0.13', released: '2024-01-19', features: ['Vercel optimization', 'Edge runtime'] },
  { version: '1.0.12', released: '2024-01-18', features: ['Project reorganization', 'TypeScript fixes'] }
]

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const clientVersion = url.searchParams.get('client_version')
    const detailed = url.searchParams.get('detailed') === 'true'
    
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || APP_VERSION
    const needsUpdate = clientVersion && clientVersion !== currentVersion
    
    const response = {
      version: currentVersion,
      timestamp: Date.now(),
      needs_update: needsUpdate,
      client_version: clientVersion,
      ...(detailed && { 
        version_history: VERSION_HISTORY,
        latest_features: VERSION_HISTORY[0]?.features || []
      })
    }
    
    return NextResponse.json(response,
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600',
          'Content-Type': 'application/json',
          'CDN-Cache-Control': 'max-age=300',
          'Vercel-CDN-Cache-Control': 'max-age=300',
        },
      }
    )
  } catch (error) {
    console.error('Version API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
