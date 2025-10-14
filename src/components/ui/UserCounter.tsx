'use client';
import { useUserCounter } from '@/hooks/useUserCounter';
import { IconImage } from '@/components/ui/OptimizedImage';
import { useState } from 'react';
export default function UserCounter() {
  const { totalUsers, usersByNightlord } = useUserCounter();
  const [showTooltip, setShowTooltip] = useState(false);
  const nightlordUsers = Object.values(usersByNightlord).reduce((sum, count) => sum + count, 0);
  const exploringUsers = Math.max(0, totalUsers - nightlordUsers);
  const sortedNightlords = Object.entries(usersByNightlord)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-2">
          <IconImage
            src="/Images/viewIcon.webp"
            alt="Active users"
            size={16}
          />
          <span className="text-sm text-gray-300 font-medium">
            {totalUsers}
          </span>
        </div>
        {}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 border border-gray-600/50 rounded-lg shadow-xl min-w-[200px]">
            <div className="text-white text-sm font-medium mb-2">
              Active users
            </div>
            {}
            {exploringUsers > 0 && (
              <div className="text-gray-300 text-sm mb-1">
                {exploringUsers} Player{exploringUsers !== 1 ? 's' : ''} exploring
              </div>
            )}
            {}
            {sortedNightlords.length > 0 && (
              <div className="border-t border-gray-600/50 pt-2 mt-2">
                {sortedNightlords.map(([nightlord, count]) => (
                  <div key={nightlord} className="text-gray-300 text-sm">
                    {count} facing {nightlord}
                  </div>
                ))}
              </div>
            )}
            {}
            {totalUsers === 0 && (
              <div className="text-gray-400 text-sm">
                No active users
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}