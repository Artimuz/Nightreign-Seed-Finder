import { useEffect } from 'react';

export function useVersionCheck() {
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.1';

  useEffect(() => {
    // Check version every 30 seconds
    const checkVersion = async () => {
      try {
        // Fetch the current version from a lightweight endpoint
        const response = await fetch('/api/version?' + Date.now(), {
          cache: 'no-store'
        });
        const data = await response.json();
        
        const serverVersion = data.version;
        const storedVersion = localStorage.getItem('app_version');
        
        // If stored version exists and differs from server version, refresh
        if (storedVersion && storedVersion !== serverVersion) {
          // Silent refresh - URL is preserved, no progress lost
          localStorage.setItem('app_version', serverVersion);
          window.location.reload();
        } else if (!storedVersion) {
          // First time, just store the version
          localStorage.setItem('app_version', serverVersion);
        }
      } catch (error) {
        // Silent fail - don't disrupt user experience
        console.warn('Version check failed:', error);
      }
    };

    // Initial check after 10 seconds
    const initialTimeout = setTimeout(checkVersion, 10000);
    
    // Then check every 30 seconds
    const interval = setInterval(checkVersion, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [currentVersion]);
}