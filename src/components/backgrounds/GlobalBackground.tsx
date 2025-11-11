'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const GlobalBackground: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="global-background">
      <div className="global-background-black" />
      <div className="global-background-gradient" />
      <div className={`global-background-image ${imageLoaded ? 'loaded' : 'loading'}`}>
        <Image
          src={isMobile ? "/Images/Top.BG_mobile.webp" : "/Images/Top.BG_desktop_2.webp"}
          alt=""
          fill
          priority
          onLoad={handleImageLoad}
          sizes="100vw"
          quality={85}
          unoptimized={false}
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  );
};