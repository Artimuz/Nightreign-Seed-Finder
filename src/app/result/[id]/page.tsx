import ClientMapResult from '../../../components/ClientMapResult'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const seedIds = Array.from({ length: 320 }, (_, i) => 
    i.toString().padStart(3, '0')
  )
  
  return seedIds.map((id) => ({
    id: id,
  }))
}

interface ResultPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id: seedId } = await params

  // Validate seed ID (should be 000-319)
  const seedNumber = parseInt(seedId)
  if (isNaN(seedNumber) || seedNumber < 0 || seedNumber > 319) {
    notFound()
  }

  // Format seed number to 3 digits with leading zeros
  const formattedSeedNumber = seedId.padStart(3, '0')

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
        seedNumber={formattedSeedNumber}
      />
    </div>
  )
}