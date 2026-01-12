import ClientMapBuilder from '../../../components/ClientMapBuilder'
import { redirect } from 'next/navigation'
import { MapTypeTextBlock } from '@/components/map/MapTypeTextBlock'
import type { MapTypeKey } from '@/lib/map/mapTypeText'
import { getMapTypeText } from '@/lib/map/mapTypeText'
import type { Metadata } from 'next'

const VALID_MAP_TYPES = ['normal', 'crater', 'mountaintop', 'noklateo', 'rotted', 'greatHollow'] as const
type ValidMapType = typeof VALID_MAP_TYPES[number]

export async function generateStaticParams() {
  return VALID_MAP_TYPES.map((mapType) => ({
    mapType: mapType,
  }))
}

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { mapType: mapTypeParam } = await params

  if (!VALID_MAP_TYPES.includes(mapTypeParam as ValidMapType)) {
    return {
      title: 'Map',
      description: 'Nightreign Seed Finder map builder.',
    }
  }

  const mapType = mapTypeParam as ValidMapType
  const mapTitle = getMapTypeText(mapType as MapTypeKey).title

  return {
    title: `${mapTitle} Map`,
    description: `Build and search seeds for the ${mapTitle} map.`,
  }
}

interface MapPageProps {
  params: Promise<{
    mapType: string
  }>
}

export default async function MapPage({ params }: MapPageProps) {
  const { mapType: mapTypeParam } = await params

  if (!VALID_MAP_TYPES.includes(mapTypeParam as ValidMapType)) {
    redirect('/404')
  }

  const mapType = mapTypeParam as ValidMapType

  return (
    <>
      <MapTypeTextBlock mapType={mapType as MapTypeKey} />
      <div 
        style={{ 
          position: 'fixed',
          top: '75px',
          bottom: '40px', 
          left: '0',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
          <ClientMapBuilder mapType={mapType} />
      </div>
    </>
  )
}