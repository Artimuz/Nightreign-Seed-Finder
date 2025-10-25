import { NextResponse } from 'next/server';
import packageJson from '../../../../package.json';

interface VersionResponse {
  version: string;
  timestamp: number;
}

function getCurrentApplicationVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version;
}

function createCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    'CDN-Cache-Control': 'max-age=300',
    'Vercel-CDN-Cache-Control': 'max-age=300'
  };
}

export async function GET(): Promise<NextResponse<VersionResponse>> {
  const applicationVersion = getCurrentApplicationVersion();
  const currentTimestamp = Date.now();
  
  const responseData: VersionResponse = { 
    version: applicationVersion,
    timestamp: currentTimestamp
  };
  
  const cacheHeaders = createCacheHeaders();
  
  return NextResponse.json(responseData, {
    headers: cacheHeaders
  });
}