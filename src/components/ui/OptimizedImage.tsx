'use client'
import React from 'react';
import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, priority = false }) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="map-card-image object-cover object-center"
      priority={priority}
      sizes="(max-width: 480px) 200px, (max-width: 768px) 250px, 350px"
    />
  );
};