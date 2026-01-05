'use client'
import React from 'react';
import Image from 'next/image';
import { pagesStaticAssetUrl, PAGES_ASSET_BASE_URL } from '@/lib/pagesAssets';

interface CardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, priority = false }) => {
  const resolvedSrc = pagesStaticAssetUrl(src)

  const isLocalSrc = resolvedSrc.startsWith('/')
  const isPagesSrc = PAGES_ASSET_BASE_URL ? resolvedSrc.startsWith(PAGES_ASSET_BASE_URL) : false

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      className="map-card-image object-cover object-center"
      priority={priority}
      sizes="(max-width: 480px) 200px, (max-width: 768px) 250px, 350px"
      unoptimized={isLocalSrc || isPagesSrc}
    />
  );
};