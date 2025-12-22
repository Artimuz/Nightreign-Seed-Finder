'use client'

import { UpdatePost as UpdatePostType } from '@/lib/updates/types'
import Image from 'next/image'

interface UpdatePostProps {
  update: UpdatePostType
  isManualMode: boolean
  isDismissed: boolean
}


export default function UpdatePost({ update, isManualMode, isDismissed }: UpdatePostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {update.version && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
              v{update.version}
            </span>
          )}
          {isManualMode && isDismissed && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              Previously Seen
            </span>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{update.title}</h2>
        <p className="text-gray-400 text-sm">Published on {formatDate(update.publishDate)}</p>
      </div>

      {/* Image */}
      {update.image && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <Image
            src={update.image}
            alt={`${update.title} - Update Image`}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            priority
            unoptimized={update.image.startsWith('/')}
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none">
        {update.content.split('\n\n').map((section, sectionIndex) => {
          const lines = section.split('\n')
          
          return lines.map((line, lineIndex) => {
            const key = `${sectionIndex}-${lineIndex}`
            
            if (line.trim() === '') return null
            
            if (line.startsWith('### ')) {
              return (
                <h3 key={key} className="text-lg font-semibold text-white mt-6 mb-3">
                  {line.replace('### ', '')}
                </h3>
              )
            }
            
            if (line.startsWith('- **')) {
              const content = line.replace('- **', '').replace('**:', ':')
              const [title, description] = content.split(': ')
              return (
                <div key={key} className="mb-2">
                  <div className="text-gray-300">
                    • <strong className="text-white">{title}</strong>: {description}
                  </div>
                </div>
              )
            }
            
            if (/^\d+\./.test(line.trim())) {
              const content = line.replace(/^\d+\.\s*/, '')
              return (
                <div key={key} className="mb-2">
                  <div className="text-gray-300">
                    {lineIndex + 1}. {content}
                  </div>
                </div>
              )
            }
            
            if (line.trim() !== '') {
              return (
                <p 
                  key={key} 
                  className="text-gray-300 mb-4 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  }}
                />
              )
            }
            
            return null
          })
        })}
      </div>

      {/* Tags */}
      {update.tags && update.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="flex flex-wrap gap-2">
            {update.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}