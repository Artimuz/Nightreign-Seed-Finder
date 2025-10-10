// Core data types
export type SlotId =
  | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"
  | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20"
  | "21" | "22" | "23" | "24" | "25" | "26" | "27";

export interface Seed {
  seed_id: string;
  map_type: string;
  Event?: string;
  nightlord: string;
  slots: Record<SlotId, string>;
}

export interface Coordinates {
  id: string;
  x: number;
  y: number;
}

// UI and State types
export interface MapState {
  displaySize: number;
  iconScale: number;
  slots: Record<string, string>;
  remainingSeeds: Seed[];
  activeSlot: string | null;
  pathLog: (string | number)[];
}

export interface IconOption {
  id: string;
  src: string;
}

// API and Error handling types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BugReportData {
  userAgent: string;
  url: string;
  timestamp: string;
  description?: string;
  steps?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'ui' | 'functionality' | 'performance' | 'data' | 'other';
  userId?: string;
  sessionId?: string;
  browserInfo?: BrowserInfo;
  errorStack?: string;
}

export interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  onLine: boolean;
  viewport: {
    width: number;
    height: number;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

// Local Storage types for future implementation
export interface UserSession {
  sessionId: string;
  userId?: string;
  createdAt: string;
  lastActivity: string;
  searchHistory: SearchHistoryEntry[];
  preferences: UserPreferences;
}

export interface SearchHistoryEntry {
  id: string;
  timestamp: string;
  mapType?: string;
  slots: Record<string, string>;
  pathLog: (string | number)[];
  resultSeedId?: string;
  duration?: number; // time spent on search in ms
}

export interface UserPreferences {
  locale: string;
  theme?: 'dark' | 'light';
  mapSize?: number;
  autoSave: boolean;
  showTutorial: boolean;
}

// Component prop types
export interface MapPageProps {
  initialMapType?: string;
}

export interface FooterProps {
  className?: string;
}

// Error types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

// Locale and internationalization types
export interface LocaleTexts {
  header: {
    changeMapButton: string;
    mapQuestion: string;
    languageSelector: string;
  };
  map: {
    title: string;
    instructions: string;
    remainingSeeds: string;
    resetButton: string;
    loading: string;
  };
  footer: {
    version: string;
    feedback: string;
    bugReport: string;
  };
  errors: {
    general: string;
    networkError: string;
    notFound: string;
    invalidSeed: string;
  };
}
