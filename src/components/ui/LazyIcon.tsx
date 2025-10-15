'use client'
import { useState, useRef, useEffect } from 'react';

interface LazyIconProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export const LazyIcon: React.FC<LazyIconProps> = ({
  src,
  alt,
  width,
  height,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`${className} flex items-center justify-center`}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain max-w-full max-h-full"
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      ) : (
        <div 
          className="bg-gray-700/50 rounded animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  );
};