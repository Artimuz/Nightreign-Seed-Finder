// Input validation utilities

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (input: string, maxLength?: number): string => {
  let sanitized = input.trim();
  
  // Remove potential XSS characters
  sanitized = sanitized
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

export const isValidSeedId = (seedId: string): boolean => {
  // Assuming seed IDs are alphanumeric with possible underscores/hyphens
  const seedIdRegex = /^[a-zA-Z0-9_-]+$/;
  return seedIdRegex.test(seedId) && seedId.length > 0 && seedId.length <= 50;
};

export const isValidSlotId = (slotId: string): boolean => {
  // Slot IDs should match the SlotId type definition
  const validSlotIds = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27"
  ];
  return validSlotIds.includes(slotId) || slotId === "nightlord";
};

export const validateBugReportData = (data: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!data.userAgent || typeof data.userAgent !== 'string') {
    errors.push('User agent is required');
  }
  
  if (!data.url || typeof data.url !== 'string' || !isValidUrl(data.url)) {
    errors.push('Valid URL is required');
  }
  
  if (!data.timestamp || typeof data.timestamp !== 'string') {
    errors.push('Timestamp is required');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('Description is too long (max 2000 characters)');
  }
  
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (data.severity && !validSeverities.includes(data.severity)) {
    errors.push('Invalid severity level');
  }
  
  const validCategories = ['ui', 'functionality', 'performance', 'data', 'other'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push('Invalid category');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};