'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { HamburgerMenu } from './HamburgerMenu';
import { SidebarMenu } from './SidebarMenu';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isHomepage = pathname === '/';
  
  const handleHomeClick = () => {
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/90 backdrop-blur-sm border-b border-gray-600/30 py-4 px-6">
        <div className="flex justify-center items-center relative">
          {!isHomepage && (
            <button
              onClick={handleHomeClick}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/90 text-white p-3 rounded-lg border border-gray-500/50 hover:border-gray-400/70 transition-all duration-200 hover:scale-105"
              title="Go to Homepage"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <Image
            src="/Images/logo_header.webp"
            alt="Nightreign Logo"
            width={314}
            height={105}
            className="object-contain"
            priority
          />
          
          {/* Hamburger Menu - positioned on the right */}
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/90 text-white p-3 rounded-lg border border-gray-500/50 hover:border-gray-400/70 transition-all duration-200 hover:scale-105 z-10"
            title="Open Menu"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
          >
            <HamburgerMenu
              isOpen={isSidebarOpen}
              className=""
            />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};