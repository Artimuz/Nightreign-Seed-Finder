'use client'
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  loading?: 'eager' | 'lazy';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  fill = false,
  loading = 'lazy',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const responsiveSizes = sizes || (
    fill ? '100vw' : 
    width ? `${width}px` :
    '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  );

  const blurPlaceholder = blurDataURL;

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={fill ? undefined : { width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${!imageLoaded ? 'animate-pulse bg-gray-200' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageLoaded ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        sizes={responsiveSizes}
        loading={priority ? 'eager' : loading}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurPlaceholder}
        onLoad={handleLoad}
        onError={handleError}
      />
    </motion.div>
  );
};

export const GameMapImage: React.FC<{
  src: string;
  alt: string;
  size: number;
  priority?: boolean;
}> = ({ src, alt, size, priority = false }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    priority={priority}
    sizes={`${size}px`}
    quality={90}
    className="object-cover rounded-lg map-shadow"
    placeholder="empty"
  />
);

export const CardImage: React.FC<{
  src: string;
  alt: string;
  priority?: boolean;
}> = ({ src, alt, priority = false }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={500}
    height={700}
    priority={priority}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
    quality={85}
    className="map-card-image"
    placeholder="empty"
  />
);

export const IconImage: React.FC<{
  src: string;
  alt: string;
  size?: number;
}> = ({ src, alt, size = 64 }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    sizes={`${size}px`}
    quality={80}
    loading="lazy"
  />
);