
export const parseURLToArray = (urlString: string): string[] => {
  if (!urlString || urlString === '/') return [];
  const cleanUrl = urlString.startsWith('/') ? urlString.slice(1) : urlString;
  const parts = cleanUrl.split('&');
  return parts;
};
export const arrayToURL = (urlArray: string[]): string => {
  if (urlArray.length === 0) return '/';
  const urlString = '/' + urlArray.join('&');
  return urlString;
};
export const arrayToObject = (urlArray: string[]): {
  mapType: string | null;
  slots: Record<string, string>;
  nightlord: string | null;
  foundSeed: string | null;
} => {
  const result = {
    mapType: null as string | null,
    slots: {} as Record<string, string>,
    nightlord: null as string | null,
    foundSeed: null as string | null
  };
  urlArray.forEach((part, index) => {
    if (part.startsWith('map_')) {
      result.mapType = part.substring(4);
      } else if (part.startsWith('nightlord=')) {
      result.nightlord = part.substring(10);
      } else if (part.startsWith('SEED=')) {
      result.foundSeed = part.substring(5);
      } else if (part.includes('=')) {
      const [slot, building] = part.split('=');
      if (slot.length === 2 && /^\d+$/.test(slot)) {
        result.slots[slot] = building;
        }
    }
  });
  return result;
};
export const objectToArray = (obj: {
  mapType: string | null;
  slots: Record<string, string>;
  nightlord: string | null;
  foundSeed: string | null;
}, preserveOrder: string[] = []): string[] => {
  const parts: string[] = [];
  if (obj.mapType) {
    parts.push(`map_${obj.mapType}`);
    }
  if (preserveOrder.length > 0) {
    preserveOrder.forEach(part => {
      if (part.includes('=') && !part.startsWith('map_') && !part.startsWith('nightlord=') && !part.startsWith('SEED=')) {
        const [slot] = part.split('=');
        if (obj.slots[slot]) {
          parts.push(`${slot}=${obj.slots[slot]}`);
          }
      }
    });
  } else {
    Object.entries(obj.slots).forEach(([slot, building]) => {
      parts.push(`${slot}=${building}`);
    });
  }
  if (obj.nightlord) {
    parts.push(`nightlord=${obj.nightlord}`);
    }
  if (obj.foundSeed) {
    parts.push(`SEED=${obj.foundSeed}`);
    }
  return parts;
};