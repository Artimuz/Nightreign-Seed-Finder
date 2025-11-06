'use client'

import dynamic from 'next/dynamic'

const MapResult = dynamic(() => import('./MapResult'), {
  ssr: false,
  loading: () => (
    <div className="w-[1000px] h-[1000px] max-w-full max-h-[90vh] aspect-square bg-gray-200 animate-pulse flex items-center justify-center">
      Loading seed map...
    </div>
  )
})

interface ClientMapResultProps {
  seedNumber: string
}

export default function ClientMapResult({ seedNumber }: ClientMapResultProps) {
  return <MapResult seedNumber={seedNumber} />
}