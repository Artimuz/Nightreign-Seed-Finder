// Application configuration constants

export const APP_CONFIG = {
  name: 'Nightreign Seed Finder',
  version: '1.0.0',
  description: 'Find patterns in Elden Ring Nightreign maps',
  
  // Local storage keys
  storage: {
    sessionKey: 'nightreign_user_session',
    preferencesKey: 'nightreign_preferences',
    historyKey: 'nightreign_search_history',
    sessionStartKey: 'sessionStart',
    sessionIdKey: 'sessionId',
  },
  
  // Limits and constraints
  limits: {
    maxSearchHistory: 50,
    maxBugReportLength: 2000,
    maxDescriptionLength: 500,
    sessionTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // API endpoints
  api: {
    log: '/api/log',
    bugReport: '/api/bug-report',
    analytics: '/api/analytics',
  },
  
  // Default user preferences
  defaultPreferences: {
    locale: 'en',
    theme: 'dark' as const,
    autoSave: true,
    showTutorial: true,
  },
  
  // Bug report categories
  bugReportCategories: [
    'ui',
    'functionality', 
    'performance',
    'data',
    'other'
  ] as const,
  
  // Bug report severity levels
  bugReportSeverity: [
    'low',
    'medium', 
    'high',
    'critical'
  ] as const,
} as const;

export type BugReportCategory = typeof APP_CONFIG.bugReportCategories[number];
export type BugReportSeverity = typeof APP_CONFIG.bugReportSeverity[number];