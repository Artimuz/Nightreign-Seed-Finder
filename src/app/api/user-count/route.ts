import { NextResponse } from 'next/server'
export const runtime = 'edge'
export async function GET() {
  try {
    return NextResponse.json(
      { 
        count: Math.floor(Math.random() * 50) + 10,
        timestamp: Date.now()
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
