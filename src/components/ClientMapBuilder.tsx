'use client'

import dynamic from 'next/dynamic'

const MapBuilder = dynamic(() => import('./MapBuilder'), {
  ssr: false,
  loading: () => (
    <div className="w-[1000px] h-[1000px] max-w-full max-h-[90vh] aspect-square bg-gray-200 animate-pulse flex items-center justify-center">
      Loading map builder...
    </div>
  )
})

type ValidMapType = 'normal' | 'crater' | 'mountaintop' | 'noklateo' | 'rotted' | 'greatHollow'

interface ClientMapBuilderProps {
  mapType: ValidMapType
}

export default function ClientMapBuilder({ mapType }: ClientMapBuilderProps) {
  return <MapBuilder mapType={mapType} />
}