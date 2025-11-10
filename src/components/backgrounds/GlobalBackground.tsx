'use client'
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export const GlobalBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleVideoLoad);
      video.addEventListener('canplay', handleVideoLoad);
      if (video.readyState >= 2) {
        handleVideoLoad();
      }
    }
    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleVideoLoad);
        video.removeEventListener('canplay', handleVideoLoad);
      }
    };
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="global-background">
      <div className="global-background-black" />
      <div className="global-background-gradient" />
      <video
        ref={videoRef}
        className={`global-background-video ${videoLoaded ? 'loaded' : 'loading'}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/Images/Top.BG_.webm" type="video/webm" />
      </video>
      <div className={`global-background-image bg-image-2 ${imageLoaded ? 'loaded' : 'loading'}`}>
        <Image
          src="/Images/BG2_.webp"
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