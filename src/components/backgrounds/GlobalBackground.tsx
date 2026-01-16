'use client'
import { pagesWebpUrl } from '@/lib/pagesAssets'

export const GlobalBackground: React.FC = () => {
  return (
    <div className="global-background">
      <div className="global-background-black" />
      <div className="global-background-gradient" />
      <div className="global-background-image">
        <picture>
          <source media="(max-width: 1180px) and (orientation: portrait)" srcSet={pagesWebpUrl('/Images/Top.BG_mobile.webp')} />
          <source media="(max-width: 767px)" srcSet={pagesWebpUrl('/Images/Top.BG_mobile.webp')} />
          <img
            src={pagesWebpUrl('/Images/Top.BG_desktop_2.webp')}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            decoding="async"
          />
        </picture>
      </div>
    </div>
  )
}
