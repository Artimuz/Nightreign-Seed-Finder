import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllUpdates, getUpdateById } from '@/lib/updates/updateManager'

interface UpdateDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getAllUpdates().map((update) => ({
    id: update.id,
  }))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function extractDescription(content: string): string {
  const line = content
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value.length > 0 && !value.startsWith('###'))

  return line ? line.replace(/\*\*/g, '') : 'Update details and release notes.'
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'bullet'; title: string; description: string | null }

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const lines = content.split('\n').map((value) => value.trim())

  for (const line of lines) {
    if (!line) {
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', text: line.replace('### ', '') })
      continue
    }

    if (line.startsWith('- **')) {
      const normalized = line.replace('- **', '').replace('**:', ':')
      const parts = normalized.split(': ')
      const title = parts[0] ?? ''
      const description = parts.length > 1 ? parts.slice(1).join(': ') : null
      blocks.push({ type: 'bullet', title, description })
      continue
    }

    blocks.push({ type: 'paragraph', text: line })
  }

  return blocks
}

export async function generateMetadata({ params }: UpdateDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const update = getUpdateById(id)

  if (!update) {
    return {
      title: 'Update not found | Nightreign Seed Finder',
      description: 'The requested update could not be found.',
    }
  }

  return {
    title: `${update.title} | Updates | Nightreign Seed Finder`,
    description: extractDescription(update.content),
  }
}

export default async function UpdateDetailPage({ params }: UpdateDetailPageProps) {
  const { id } = await params
  const update = getUpdateById(id)

  if (!update) {
    notFound()
  }

  const blocks = parseContent(update.content)

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            {update.version ? (
              <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">v{update.version}</span>
            ) : null}
            <span className="text-xs text-gray-400">{formatDate(update.publishDate)}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{update.category}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold">{update.title}</h1>
          <div className="mt-4">
            <Link className="text-sm text-gray-200 underline hover:text-white" href="/updates" prefetch={false}>
              Back to all updates
            </Link>
          </div>
        </header>

        {update.image ? (
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-600/40">
            <Image
              src={update.image}
              alt={`${update.title} - update image`}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
              unoptimized={update.image.startsWith('/')}
            />
          </div>
        ) : null}

        <div className="mt-10 space-y-4 text-gray-300">
          {blocks.map((block, index) => {
            const key = `${block.type}-${index}`

            if (block.type === 'heading') {
              return (
                <h2 key={key} className="pt-4 text-xl font-semibold text-white">
                  {block.text}
                </h2>
              )
            }

            if (block.type === 'bullet') {
              return (
                <p key={key}>
                  <span className="font-semibold text-white">• {block.title}</span>
                  {block.description ? <span>: {block.description}</span> : null}
                </p>
              )
            }

            return <p key={key}>{block.text}</p>
          })}
        </div>

        {update.tags && update.tags.length > 0 ? (
          <div className="mt-10 border-t border-gray-600/50 pt-6">
            <div className="flex flex-wrap gap-2">
              {update.tags.map((tag) => (
                <span key={tag} className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  )
}
