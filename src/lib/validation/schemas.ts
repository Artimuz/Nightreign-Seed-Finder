import { z } from 'zod'

export const logRequestSchema = z.object({
  action: z.enum(['seed_found', 'search_performed', 'error_occurred']),
  data: z.object({
    seed_id: z.string().optional(),
    map_type: z.string().optional(),
    search_criteria: z.record(z.any()).optional(),
    error_message: z.string().optional(),
    timestamp: z.number().optional(),
  }),
})

export const versionRequestSchema = z.object({
  timestamp: z.number().optional(),
})

export type LogRequest = z.infer<typeof logRequestSchema>
export type VersionRequest = z.infer<typeof versionRequestSchema>