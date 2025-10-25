import { NextResponse } from 'next/server';

export async function GET() {
  // Get version from environment or package.json
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  
  return NextResponse.json(
    { 
      version,
      timestamp: Date.now()
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  );
}