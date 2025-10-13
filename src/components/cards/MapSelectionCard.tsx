'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapType } from '@/lib/types/game';

interface MapSelectionCardProps {
  mapType: string;
  title: string;
  imageSrc: string;
  onSelect: (mapType: MapType) => void;
  isSelected?: boolean;
}
const cardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  selected: { opacity: 0 }
};
export const MapSelectionCard: React.FC<MapSelectionCardProps> = ({
  mapType, title, imageSrc, onSelect, isSelected
}) => {
  if (!mapType || !title || !imageSrc) {
    return null;
  }
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isSelected ? "selected" : "visible"}
      whileHover={{
        zIndex: 10
      }}
      className="map-selection-card group cursor-pointer"
      onClick={() => onSelect(mapType as MapType)}
    >
      {}
      <div className="map-card-image-container">
        <div className="map-card-image-wrapper">
          <Image
            src={imageSrc}
            alt={title}
            width={500}
            height={700}
            className="map-card-image"
            sizes="500px"
            priority
          />
          {}
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