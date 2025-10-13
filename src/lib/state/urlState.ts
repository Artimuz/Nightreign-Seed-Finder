import { URLState } from '@/lib/types/game';
export const encodeURLState = (state: URLState, slotOrder?: string[]): string => {
  const parts: string[] = [];
  if (state.mapType) {
    parts.push(`map_${state.mapType}`);
  }
  if (slotOrder && slotOrder.length > 0) {
    slotOrder.forEach(slotId => {
      if (state.slots[slotId]) {
        parts.push(`${slotId}=${state.slots[slotId]}`);
      }
    });
  } else {
    Object.entries(state.slots).forEach(([slot, building]) => {
      parts.push(`${slot}=${building}`);
    });
  }
  if (state.nightlord) {
    parts.push(`nightlord=${state.nightlord}`);
  }
  if (state.foundSeed) {
    parts.push(`SEED=${state.foundSeed}`);
  }
  return parts.join('&');
};
export const decodeURLState = (url: string): URLState => {
  const state: URLState = {
    mapType: null,
    slots: {},
    nightlord: null,
    foundSeed: null
  };
  if (!url) {
    return state;
  }
  const parts = url.split('&');
  for (const part of parts) {
    if (part.startsWith('map_')) {
      state.mapType = part.substring(4);
      } else if (part.startsWith('nightlord=')) {
      state.nightlord = part.substring(10);
      } else if (part.startsWith('SEED=')) {
      state.foundSeed = part.substring(5);
      } else if (part.includes('=')) {
      const [slot, building] = part.split('=');
      if (slot.length === 2 && /^\d+$/.test(slot)) {
        state.slots[slot] = building;
      }
    }
  }
  return state;
};