import ClientMapResult from '../../../components/ClientMapResult'
import { notFound } from 'next/navigation'
import seedData from '../../../../public/data/seed_data.json'

type SeedRecord = {
  seed_id: string
}

const seeds = seedData as SeedRecord[]
const seedIdSet = new Set(seeds.map((seed) => seed.seed_id))

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

export default async function ResultPage({ params }: ResultPageProps) {
  const { id: seedId } = await params

  const parsedSeedId = Number(seedId)
  if (!Number.isFinite(parsedSeedId) || !Number.isInteger(parsedSeedId) || parsedSeedId < 0) {
    notFound()
  }

  const canonicalSeedId = parsedSeedId <= 319
    ? String(parsedSeedId).padStart(3, '0')
    : String(parsedSeedId)

  if (!seedIdSet.has(canonicalSeedId)) {
    notFound()
  }

  return (
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
      <ClientMapResult 
        seedNumber={canonicalSeedId}
      />
    </div>
  )
}