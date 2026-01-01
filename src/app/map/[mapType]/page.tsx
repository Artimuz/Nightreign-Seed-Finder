import ClientMapBuilder from '../../../components/ClientMapBuilder'
import { redirect } from 'next/navigation'

const VALID_MAP_TYPES = ['normal', 'crater', 'mountaintop', 'noklateo', 'rotted', 'greatHollow'] as const
type ValidMapType = typeof VALID_MAP_TYPES[number]

export async function generateStaticParams() {
  return VALID_MAP_TYPES.map((mapType) => ({
    mapType: mapType,
  }))
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

  return (
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
        <ClientMapBuilder mapType={mapTypeParam as ValidMapType} />
    </div>
  )
}