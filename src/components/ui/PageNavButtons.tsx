'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type PageNavButton = {
  href: string
  label: string
}

type PageNavButtonsProps = {
  title?: string
  links: PageNavButton[]
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export default function PageNavButtons({ title, links }: PageNavButtonsProps) {
  const pathname = usePathname()

  const currentPathname = normalizePathname(pathname)

  const visibleLinks = links.filter((link) => link.href.trim().length > 0 && link.label.trim().length > 0)

  if (visibleLinks.length === 0) {
    return null
  }

  return (
    <nav className="mt-10 border-t border-gray-600/40 pt-6">
      {title ? <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h2> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {visibleLinks.map((link) => {
          const linkPathname = normalizePathname(link.href)
          const isCurrent = currentPathname === linkPathname

          if (isCurrent) {
            return (
              <span
                key={link.href}
                aria-disabled="true"
                className="inline-flex items-center rounded-md border border-gray-700/50 bg-black/10 px-4 py-2 text-sm font-medium text-gray-500"
              >
                {link.label}
              </span>
            )
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="inline-flex items-center rounded-md border border-gray-600/50 bg-black/20 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-black/30 hover:text-white"
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
