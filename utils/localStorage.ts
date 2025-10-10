import { UserSession, SearchHistoryEntry, UserPreferences } from '../types';

const STORAGE_KEYS = {
  USER_SESSION: 'nightreign_user_session',
  PREFERENCES: 'nightreign_preferences',
  SEARCH_HISTORY: 'nightreign_search_history',
} as const;

// Safe localStorage wrapper for SSR compatibility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  },
};

// User session management
export const getUserSession = (): UserSession | null => {
  const sessionData = safeLocalStorage.getItem(STORAGE_KEYS.USER_SESSION);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch (error) {
    console.warn('Failed to parse user session:', error);
    return null;
  }
};

export const saveUserSession = (session: UserSession): boolean => {
  try {
    return safeLocalStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save user session:', error);
    return false;
  }
};

// User preferences management
export const getUserPreferences = (): Partial<UserPreferences> => {
  const prefsData = safeLocalStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (!prefsData) return {};
  
  try {
    return JSON.parse(prefsData);
  } catch (error) {
    console.warn('Failed to parse user preferences:', error);
    return {};
  }
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>): boolean => {
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    return safeLocalStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save user preferences:', error);
    return false;
  }
};

// Search history management
export const getSearchHistory = (): SearchHistoryEntry[] => {
  const historyData = safeLocalStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
  if (!historyData) return [];
  
  try {
    return JSON.parse(historyData);
  } catch (error) {
    console.warn('Failed to parse search history:', error);
    return [];
  }
};

export const addSearchHistoryEntry = (entry: SearchHistoryEntry): boolean => {
  try {
    const history = getSearchHistory();
    const maxEntries = 50; // Limit history size
    
    // Remove any existing entry with the same ID
    const filtered = history.filter(h => h.id !== entry.id);
    
    // Add new entry at the beginning
    const updated = [entry, ...filtered].slice(0, maxEntries);
    
    return safeLocalStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to add search history entry:', error);
    return false;
  }
};

export const clearSearchHistory = (): boolean => {
  return safeLocalStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
};

// Utility functions
export const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};