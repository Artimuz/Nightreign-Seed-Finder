import React from 'react';
import { useRouter } from 'next/router';

import Button from '../ui/Button';
import useLocale from '../../hooks/useLocale';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = true, 
  title,
  className = '' 
}) => {
  const router = useRouter();
  const { texts, changeLocale, SUPPORTED_LOCALES } = useLocale();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <header className={`h-12 bg-gray-800 flex items-center justify-between px-6 ${className}`}>
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBackClick}
          >
            {texts.header?.changeMapButton || 'Back'}
          </Button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {texts.header?.mapQuestion && (
          <p className="text-sm text-gray-200 max-w-[600px] text-center hidden md:block">
            {texts.header.mapQuestion}
          </p>
        )}

        <select
          value={useLocale().locale}
          onChange={(e) => changeLocale(e.target.value)}
          className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          aria-label="Language selector"
        >
          {SUPPORTED_LOCALES.map((loc) => (
            <option key={loc.code} value={loc.code}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;