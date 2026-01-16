'use client'
import React from 'react';
import Image from 'next/image';
import { PAGES_ASSET_BASE_URL } from '@/lib/pagesAssets';

interface CardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, priority = false }) => {
  const isLocalSrc = src.startsWith('/')
  const isPagesSrc = PAGES_ASSET_BASE_URL ? src.startsWith(PAGES_ASSET_BASE_URL) : false

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="map-card-image object-cover object-center"
      priority={priority}
      sizes="(max-width: 480px) 200px, (max-width: 1180px) 250px, 350px"
      unoptimized={isLocalSrc || isPagesSrc}
    />
  );
};