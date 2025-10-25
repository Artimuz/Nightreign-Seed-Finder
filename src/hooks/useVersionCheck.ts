import { useEffect } from 'react';
import { APP_VERSION } from '@/lib/constants/version';

export function useVersionCheck() {
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || APP_VERSION;

  useEffect(() => {
    // Check version every 15 minutes
    const checkVersion = async () => {
      try {
        // Fetch the current version from a lightweight endpoint
        const response = await fetch('/api/version', {
          cache: 'default'
        });
        const data = await response.json();
        
        const serverVersion = data.version;
        const storedVersion = localStorage.getItem('app_version');

        // Define minimum required version to force update
        const minimumRequiredVersion = APP_VERSION;
        
        // If no stored version, check if we've already tried to update this session
        if (!storedVersion) {
          const hasTriedUpdate = sessionStorage.getItem('version_update_attempted');
          if (!hasTriedUpdate && serverVersion === minimumRequiredVersion) {
            sessionStorage.setItem('version_update_attempted', 'true');
            localStorage.setItem('app_version', serverVersion);
            // Give a small delay to ensure storage is written
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            // Either already tried update this session, or server version doesn't require force update
            localStorage.setItem('app_version', serverVersion);
          }
        } else if (storedVersion !== serverVersion) {
          // Version mismatch detected, refresh
          localStorage.setItem('app_version', serverVersion);
          window.location.reload();
        }
      } catch {
        // Silent fail - don't disrupt user experience
      }
    };

    // Initial check after 10 seconds
    const initialTimeout = setTimeout(checkVersion, 10000);
    
    // Then check every 15 minutes
    const interval = setInterval(checkVersion, 15 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [currentVersion]);
}