'use client';
import { useUserSession } from '@/hooks/useUserSession';
interface SessionProviderProps {
  children: React.ReactNode;
}
export default function SessionProvider({ children }: SessionProviderProps) {
  useUserSession();
  return <>{children}</>;
}