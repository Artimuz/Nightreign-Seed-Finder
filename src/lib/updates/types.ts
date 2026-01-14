export interface UpdatePost {
  id: string
  version?: string
  title: string
  content: string
  image?: string
  imageLabel?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  publishDate: string
  category: 'feature' | 'bugfix' | 'announcement' | 'security'
  showInModal: boolean
  tags?: string[]
}

export interface UpdatePreferences {
  dismissedUpdates: string[]
  lastSeenUpdate?: string
  showUpdateModals: boolean
  lastDismissalDate?: string
  lastManualView?: string
}

export type UpdateDisplayMode = 'automatic' | 'manual'

export interface UpdateModalState {
  isOpen: boolean
  currentIndex: number
  mode: UpdateDisplayMode
  updates: UpdatePost[]
}