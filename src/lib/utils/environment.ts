export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname.startsWith('localhost:') ||
         hostname === '::1' ||
         /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
         /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
         /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
};
export const extractNightlordName = (nightlord: string | undefined): string | null => {
  if (!nightlord || typeof nightlord !== 'string') return null;
  const parts = nightlord.split('_');
  if (parts.length < 2) return null;
  return parts.slice(1).join('_');
};
export const sanitizeString = (input: string, maxLength: number): string => {
  return input.substring(0, maxLength).trim();
};