'use client'
import { useEffect, useState } from 'react'

export const GlobalBackground: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="global-background">
      <div className="global-background-black" />
      <div className="global-background-gradient" />
      <div className={`global-background-image ${imageLoaded ? 'loaded' : 'loading'}`}>
        <picture>
          <source media="(max-width: 767px)" srcSet="/Images/Top.BG_mobile.webp" />
          <img
            src="/Images/Top.BG_desktop_2.webp"
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
        </picture>
      </div>
    </div>
  )
}
