'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { CardImage } from '@/components/ui/OptimizedImage';
import Image from 'next/image';

interface MapSelectionCardProps {
  mapType: string;
  title: string;
  imageSrc: string;
  onClick?: (event: React.MouseEvent) => void;
}

const cardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  selected: { opacity: 0 }
};

export const MapSelectionCard: React.FC<MapSelectionCardProps> = ({
  mapType, title, imageSrc, onClick
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
      'normal': '/Images/mapTypes/map_icon/normalIcon.webp',
      'crater': '/Images/mapTypes/map_icon/craterIcon.webp',
      'mountaintop': '/Images/mapTypes/map_icon/mountainIcon.webp',
      'noklateo': '/Images/mapTypes/map_icon/noklateoIcon.webp',
      'rotted': '/Images/mapTypes/map_icon/rotIcon.webp'
    };
    return iconMap[mapType.toLowerCase()] || '/Images/mapTypes/map_icon/normalIcon.webp';
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
    setShowMapIcon(true);
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
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        zIndex: 10
      }}
      className="map-selection-card group cursor-pointer relative"
      style={{ overflow: 'visible' }}
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
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-600/50"></div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

        <AnimatePresence>
          {showMapIcon && (
            <motion.div
              className="absolute top-2 left-2 z-20 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={handleMapIconMouseEnter}
              onMouseLeave={handleMapIconMouseLeave}
            >
              <Image
                src="/Images/UIIcons/map_icon.png"
                alt="Map icon"
                width={40}
                height={40}
                className="object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
                }}
              />
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
            <div className="map-card-title">
              <h3 className="text-white font-bold text-base leading-tight text-center seed-finder-glow">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </motion.div>
  );
};