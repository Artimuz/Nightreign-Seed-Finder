import { ReactNode } from 'react'
import { pagesWebpUrl } from '@/lib/pagesAssets'

interface DecoratedArticleProps {
  children: ReactNode
  className?: string
}

export default function DecoratedArticle({ children, className = '' }: DecoratedArticleProps) {
  return (
    <article className={`relative rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10 ${className}`}>
      <div
        className="absolute left-1/2 top-0 h-[40px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${pagesWebpUrl('/Images/UI/ern-border-top.webp')})`,
        }}
        aria-hidden="true"
      />
      {children}
      <div
        className="absolute bottom-0 left-1/2 h-[40px] w-full max-w-[600px] -translate-x-1/2 translate-y-1/2 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${pagesWebpUrl('/Images/UI/ern-border-bottom.webp')})`,
        }}
        aria-hidden="true"
      />
    </article>
  )
}
