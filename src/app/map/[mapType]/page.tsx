import ClientMapBuilder from '../../../components/ClientMapBuilder'
import Link from 'next/link'

const VALID_MAP_TYPES = ['normal', 'crater', 'mountaintop', 'noklateo', 'rotted', 'forsaken'] as const
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

  // Validate map type
  if (!VALID_MAP_TYPES.includes(mapTypeParam as ValidMapType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Map Type</h1>
          <p className="text-gray-600 mb-4">
            Valid map types: {VALID_MAP_TYPES.join(', ')}
          </p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block text-center no-underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
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