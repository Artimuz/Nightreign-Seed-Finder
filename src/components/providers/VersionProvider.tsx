'use client';

import { useVersionCheck } from '@/hooks/useVersionCheck';

export function VersionProvider({ children }: { children: React.ReactNode }) {
  useVersionCheck();

  return <>{children}</>;
}