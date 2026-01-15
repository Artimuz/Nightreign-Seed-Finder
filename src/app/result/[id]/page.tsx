import ClientMapResult from '../../../components/ClientMapResult'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import seedData from '../../../../public/data/seed_data.json'
import { MapTypeTextBlock } from '@/components/map/MapTypeTextBlock'
import { eventExtraText, nightlordExtraText } from '@/lib/content/seedExtraText'
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

function normalizeSeedId(seedId: string): string | null {
  const parsedSeedId = Number(seedId)
  if (!Number.isFinite(parsedSeedId) || !Number.isInteger(parsedSeedId) || parsedSeedId < 0) {
    return null
  }

  const canonicalSeedId = parsedSeedId <= 319 ? String(parsedSeedId).padStart(3, '0') : String(parsedSeedId)
  if (!seedIdSet.has(canonicalSeedId)) {
    return null
  }

  return canonicalSeedId
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { id: seedId } = await params
  const canonicalSeedId = normalizeSeedId(seedId)

  if (!canonicalSeedId) {
    return { title: 'Pattern | Nightreign Seed Finder' }
  }

  return {
    title: `Pattern ${canonicalSeedId} | Nightreign Seed Finder`,
  }
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

  const canonicalSeedId = normalizeSeedId(seedId)
  if (!canonicalSeedId) {
    notFound()
  }

  const mapType = seedMapTypeById.get(canonicalSeedId)
  const mapTypeKey = mapTypeLabelToKey(mapType)
  const seed = seeds.find((candidate) => candidate.seed_id === canonicalSeedId) ?? null

  const nightlordKey = seed?.nightlord?.trim() ?? ''
  const eventKey = seed?.Event?.trim() ?? ''

  const nightlordText = nightlordKey.length > 0 ? nightlordExtraText[nightlordKey] : undefined
  const eventText = eventKey.length > 0 ? eventExtraText[eventKey] : undefined

  const additionalSections = [
    nightlordText ? { title: 'Nightlord', text: nightlordText } : null,
    eventText ? { title: 'Event', text: eventText } : null,
  ].filter((section): section is { title: string; text: string } => section !== null)

  return (
    <>
      {mapTypeKey ? <MapTypeTextBlock mapType={mapTypeKey} additionalSections={additionalSections} /> : null}
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
