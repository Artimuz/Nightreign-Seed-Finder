'use client'
import { motion } from 'framer-motion';
import { MAP_TYPES } from '@/lib/types';
import { useState, useEffect } from 'react';
import { getResponsiveMapSize } from '@/lib/constants/mapSizing';
import { SeedCounter } from './SeedCounter';
import { GameMapImage } from '@/components/ui/OptimizedImage';
interface MapDisplayProps {
  mapType: string;
}
export const MapDisplay: React.FC<MapDisplayProps> = ({ mapType }) => {
  const mapData = MAP_TYPES[mapType as keyof typeof MAP_TYPES];
  const [mapSize, setMapSize] = useState(900);
  useEffect(() => {
    const updateMapSize = () => {
      const newSize = getResponsiveMapSize(window.innerWidth, window.innerHeight);
      setMapSize(newSize);
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);
  if (!mapData) return null;
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {}
      <div
        className="relative"
        style={{ width: mapSize, height: mapSize }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GameMapImage
            src={mapData.mapImage}
            alt={mapData.title}
            size={mapSize}
            priority
          />
          {}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          
          <SeedCounter />
        </motion.div>
      </div>
    </motion.div>
  );
};