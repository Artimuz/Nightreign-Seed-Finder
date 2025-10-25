import { useEffect } from 'react';
import { APP_VERSION } from '@/lib/constants/version';

export function useVersionCheck() {
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || APP_VERSION;

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/api/version', {
          cache: 'default'
        });
        const data = await response.json();
        
        const serverVersion = data.version;
        const storedVersion = localStorage.getItem('app_version');

        const minimumRequiredVersion = APP_VERSION;
        if (!storedVersion) {
          const hasTriedUpdate = sessionStorage.getItem('version_update_attempted');
          if (!hasTriedUpdate && serverVersion === minimumRequiredVersion) {
            sessionStorage.setItem('version_update_attempted', 'true');
            localStorage.setItem('app_version', serverVersion);
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            localStorage.setItem('app_version', serverVersion);
          }
        } else if (storedVersion !== serverVersion) {
          localStorage.setItem('app_version', serverVersion);
          window.location.reload();
        }
      } catch {
      }
    };

    const initialTimeout = setTimeout(checkVersion, 10000);
    
    const interval = setInterval(checkVersion, 15 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [currentVersion]);
}