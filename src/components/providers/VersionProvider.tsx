'use client';

import { useVersionCheck } from '@/hooks/useVersionCheck';

export function VersionProvider({ children }: { children: React.ReactNode }) {
  useVersionCheck(); // Just run the version check, no UI needed

  return <>{children}</>;
}