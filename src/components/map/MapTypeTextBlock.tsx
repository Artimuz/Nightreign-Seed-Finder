'use client'

import Link from 'next/link'
import { useLayoutEffect, useMemo, useState } from 'react'
import { getMapTypeText, type MapTypeKey } from '@/lib/map/mapTypeText'

const storageKey = 'seedfinder-maptext-visible'

function readVisibilityFromStorage(): boolean | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) {
      return null
    }
    return raw === 'true'
  } catch {
    return null
  }
}

function writeVisibilityToStorage(visible: boolean) {
  try {
    localStorage.setItem(storageKey, String(visible))
  } catch {
    return
  }
}

export function MapTypeTextBlock({ mapType }: { mapType: MapTypeKey }) {
  const mapText = useMemo(() => getMapTypeText(mapType), [mapType])
  const [visible, setVisible] = useState(true)

  useLayoutEffect(() => {
    const stored = readVisibilityFromStorage()
    if (stored !== null) {
      setVisible(stored)
    }
  }, [])

  return (
    <div className="fixed left-0 right-0 top-[75px] z-20 px-4 pb-3">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-gray-600/40 bg-black/85 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <h2 className="min-w-0 truncate text-sm font-semibold text-gray-100">{mapText.title}</h2>
          {!visible ? (
            <button
              type="button"
              onClick={() => {
                const next = true
                writeVisibilityToStorage(next)
                setVisible(next)
              }}
              className="shrink-0 rounded-md bg-gray-700/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-600"
            >
              Show
            </button>
          ) : null}
        </div>

        {visible ? (
          <div className="space-y-3 px-4 pb-4 text-sm text-gray-300">
            {mapText.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div>
              <Link
                href={mapText.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 underline hover:text-white"
              >
                Source
              </Link>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const next = false
                  writeVisibilityToStorage(next)
                  setVisible(next)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
              >
                Hide
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
