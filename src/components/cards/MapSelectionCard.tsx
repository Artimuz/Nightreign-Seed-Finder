'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { CardImage } from '@/components/ui/OptimizedImage';
import Image from 'next/image';
import { pagesWebpUrl, pagesPngUrl } from '@/lib/pagesAssets';

interface MapSelectionCardProps {
  mapType: string;
  title: string;
  imageSrc: string;
  onClick?: (event: React.MouseEvent) => void;
  isLocked?: boolean;
  seedCounts?: {
    nightlordSeeds: number;
    total: number;
  };
}

export const MapSelectionCard: React.FC<MapSelectionCardProps> = ({
  mapType, title, imageSrc, onClick, isLocked = false, seedCounts
}) => {
  const [showMapIcon, setShowMapIcon] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [iconSize, setIconSize] = useState(200);
  const [mounted, setMounted] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMapIconSrc = (mapType: string) => {
    const iconMap: { [key: string]: string } = {
      'normal': pagesWebpUrl('/Images/mapTypes/map_icon/normalIcon.webp'),
      'crater': pagesWebpUrl('/Images/mapTypes/map_icon/craterIcon.webp'),
      'mountaintop': pagesWebpUrl('/Images/mapTypes/map_icon/mountainIcon.webp'),
      'noklateo': pagesWebpUrl('/Images/mapTypes/map_icon/noklateoIcon.webp'),
      'rotted': pagesWebpUrl('/Images/mapTypes/map_icon/rotIcon.webp'),
      'greathollow': pagesWebpUrl('/Images/mapTypes/map_icon/greatHollowIcon.webp')
    };
    return iconMap[mapType.toLowerCase()] || pagesWebpUrl('/Images/mapTypes/map_icon/normalIcon.webp');
  };

  const calculateTooltipPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const calculatedIconSize = Math.round(rect.width * 0.7);
      const tooltipHeight = calculatedIconSize + 24;
      const tooltipWidth = calculatedIconSize + 24;

      setIconSize(calculatedIconSize);
      setTooltipPosition({
        top: rect.top - 30 - tooltipHeight,
        left: cardCenterX - tooltipWidth / 2
      });
    }
  };

  const handleCardMouseEnter = () => {
    if (!isLocked) {
      setShowMapIcon(true);
    }
  };

  const handleCardMouseLeave = () => {
    setShowMapIcon(false);
  };

  const handleMapIconMouseEnter = () => {
    calculateTooltipPosition();
    setShowTooltip(true);
  };

  const handleMapIconMouseLeave = () => {
    setShowTooltip(false);
  };

  if (!mapType || !title || !imageSrc) {
    return null;
  }

  return (
    <motion.div
      ref={cardRef}
      whileHover={{
        zIndex: 10
      }}
      className={`map-selection-card group ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} relative`}
      style={{ 
        overflow: 'visible',
        filter: isLocked ? 'saturate(0)' : 'saturate(1)'
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      onClick={onClick}
    >
        {mounted && showTooltip && createPortal(
          <AnimatePresence>
            <motion.div
              className="fixed z-[9999] bg-black/90 rounded-lg p-3 border border-gray-600/50 shadow-xl pointer-events-none"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`
              }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Image
                src={getMapIconSrc(mapType)}
                alt={`${title} icon`}
                width={iconSize}
                height={iconSize}
                className="object-contain"
                unoptimized
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-600/50"></div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

        <AnimatePresence>
          {(showMapIcon || isLocked) && (
            <motion.div
              className="absolute top-2 left-2 z-20 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={!isLocked ? handleMapIconMouseEnter : undefined}
              onMouseLeave={!isLocked ? handleMapIconMouseLeave : undefined}
            >
              {isLocked ? (
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
                    <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                  </svg>
                </div>
              ) : (
                <Image
                  src={pagesPngUrl('/Images/UIIcons/map_icon.png')}
                  alt="Map icon"
                  width={40}
                  height={40}
                  className="object-contain drop-shadow-2xl"
                  unoptimized
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="map-card-image-container">
          <div className="map-card-image-wrapper">
            <CardImage
              src={imageSrc}
              alt={title}
              priority
            />
            <div className="map-card-title relative">
              <h3 className="text-white text-base leading-tight text-center seed-finder-glow" style={{ fontFamily: 'Mantinia, serif' }}>
                {title}
              </h3>
              {seedCounts && (
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2" style={{ top: '100%', marginTop: '-8px' }}>
                  <p className="text-white text-sm text-center seed-finder-glow whitespace-nowrap" style={{ fontFamily: 'Mantinia, serif' }}>
                    {seedCounts.nightlordSeeds} / {seedCounts.total}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
  );
};