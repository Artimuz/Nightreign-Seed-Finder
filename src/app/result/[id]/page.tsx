import ClientMapResult from '../../../components/ClientMapResult'
import { notFound } from 'next/navigation'
import seedData from '../../../../public/data/seed_data.json'
import { MapTypeTextBlock } from '@/components/map/MapTypeTextBlock'
import type { Seed } from '@/lib/types'
import type { MapTypeKey } from '@/lib/map/mapTypeText'

const seeds = seedData as Seed[]
const seedIdSet = new Set(seeds.map((seed) => seed.seed_id))
const seedMapTypeById = new Map(seeds.map((seed) => [seed.seed_id, seed.map_type]))

export async function generateStaticParams() {
  return seeds.map((seed) => ({
    id: seed.seed_id,
  }))
}

interface ResultPageProps {
  params: Promise<{
    id: string
  }>
}

function mapTypeLabelToKey(value: string | null | undefined): MapTypeKey | null {
  if (!value) {
    return null
  }

  if (value === 'Normal') {
    return 'normal'
  }

  if (value === 'Crater') {
    return 'crater'
  }

  if (value === 'Mountaintop') {
    return 'mountaintop'
  }

  if (value === 'Rotted') {
    return 'rotted'
  }

  if (value === 'Noklateo') {
    return 'noklateo'
  }

  if (value === 'Great Hollow') {
    return 'greatHollow'
  }

  return null
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id: seedId } = await params

  const parsedSeedId = Number(seedId)
  if (!Number.isFinite(parsedSeedId) || !Number.isInteger(parsedSeedId) || parsedSeedId < 0) {
    notFound()
  }

  const canonicalSeedId = parsedSeedId <= 319 ? String(parsedSeedId).padStart(3, '0') : String(parsedSeedId)

  if (!seedIdSet.has(canonicalSeedId)) {
    notFound()
  }

  const mapType = seedMapTypeById.get(canonicalSeedId)
  const mapTypeKey = mapTypeLabelToKey(mapType)

  return (
    <>
      {mapTypeKey ? <MapTypeTextBlock mapType={mapTypeKey} /> : null}
      <div 
        style={{ 
          position: 'fixed',
          top: '65px', 
          bottom: '45px', 
          left: '0',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <ClientMapResult seedNumber={canonicalSeedId} />
      </div>
    </>
  )
}
