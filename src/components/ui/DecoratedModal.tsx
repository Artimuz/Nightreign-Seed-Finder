import { ReactNode } from 'react'
import { pagesWebpUrl } from '@/lib/pagesAssets'

interface DecoratedModalProps {
  children: ReactNode
  className?: string
  hueRotate?: number
}

export default function DecoratedModal({ children, className = '', hueRotate = 0 }: DecoratedModalProps) {
  const filterStyle = hueRotate !== 0 ? { filter: `hue-rotate(${hueRotate}deg)` } : undefined

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute left-1/2 top-0 h-[40px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat pointer-events-none z-10"
        style={{
          backgroundImage: `url(${pagesWebpUrl('/Images/UI/ern-border-top.webp')})`,
          ...filterStyle,
        }}
        aria-hidden="true"
      />
      {children}
      <div
        className="absolute bottom-0 left-1/2 h-[40px] w-full max-w-[600px] -translate-x-1/2 translate-y-1/2 bg-contain bg-center bg-no-repeat pointer-events-none z-10"
        style={{
          backgroundImage: `url(${pagesWebpUrl('/Images/UI/ern-border-bottom.webp')})`,
          ...filterStyle,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
