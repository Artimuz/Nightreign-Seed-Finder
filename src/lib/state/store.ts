'use client'
import { create } from 'zustand';
import { GameState, URLState, Seed, MapType, NightlordType } from '@/lib/types/game';
import { searchSeeds } from '@/lib/data/seedSearch';
import { arrayToURL, arrayToObject, objectToArray } from './urlArrayManager';
export const useGameStore = create<GameState>((set, get) => ({
  mapType: null,
  slots: {},
  nightlord: null,
  foundSeed: null,
  urlArray: [],
  urlHistory: [[]],
  urlHistoryIndex: 0,
  currentPhase: 'selection',
  activeSlot: null,
  activeBuildingPanel: false,
  matchingSeeds: [],
  _isInternalURLUpdate: false,
  sessionStartTime: Date.now(),
  loggedSeeds: [],
  arrayToObject: (urlArray) => {
    return arrayToObject(urlArray);
  },
  objectToArray: (urlState) => {
    return objectToArray(urlState);
  },
  setMapType: (mapType) => {
    const state = get();
    const newArray = [`map_${mapType}`];
    const newHistory = [...state.urlHistory.slice(0, state.urlHistoryIndex + 1), newArray];
    const newObject = arrayToObject(newArray);
    const matchingSeeds = searchSeeds({
      mapType: newObject.mapType!,
      slots: newObject.slots,
      nightlord: newObject.nightlord
    });
    set({
      mapType: newObject.mapType as MapType,
      slots: newObject.slots,
      nightlord: newObject.nightlord as NightlordType,
      foundSeed: newObject.foundSeed,
      urlArray: newArray,
      urlHistory: newHistory,
      urlHistoryIndex: newHistory.length - 1,
      currentPhase: 'building',
      matchingSeeds
    });
    get().updateURL();
  },
  setSlot: (slotId, building) => {
    const state = get();
    let newArray = [...state.urlArray];
    if (building === 'empty' || building === null) {
      newArray = newArray.filter(part => !part.startsWith(`${slotId}=`));
      } else {
      const slotPart = `${slotId}=${building}`;
      const existingIndex = newArray.findIndex(part => part.startsWith(`${slotId}=`));
      if (existingIndex >= 0) {
        newArray[existingIndex] = slotPart;
        } else {
        newArray.push(slotPart);
        }
    }
    const newHistory = [...state.urlHistory.slice(0, state.urlHistoryIndex + 1), newArray];
    const newObject = arrayToObject(newArray);
    const matchingSeeds = searchSeeds({
      mapType: newObject.mapType!,
      slots: newObject.slots,
      nightlord: newObject.nightlord
    });
    let currentPhase = state.currentPhase;
    if (matchingSeeds.length === 1 && !newObject.foundSeed) {
      newArray.push(`SEED=${matchingSeeds[0].seed_id}`);
      const finalObject = arrayToObject(newArray);
      currentPhase = 'complete';
      const finalHistory = [...newHistory, newArray];
      set({
        mapType: finalObject.mapType as MapType,
        slots: finalObject.slots,
        nightlord: finalObject.nightlord as NightlordType,
        foundSeed: finalObject.foundSeed,
        urlArray: newArray,
        urlHistory: finalHistory,
        urlHistoryIndex: finalHistory.length - 1,
        currentPhase,
        activeSlot: null,
        activeBuildingPanel: false,
        matchingSeeds
      });
      get().logResult(matchingSeeds[0].seed_id);
    } else {
      set({
        mapType: newObject.mapType as MapType,
        slots: newObject.slots,
        nightlord: newObject.nightlord as NightlordType,
        foundSeed: newObject.foundSeed,
        urlArray: newArray,
        urlHistory: newHistory,
        urlHistoryIndex: newHistory.length - 1,
        currentPhase,
        activeSlot: null,
        activeBuildingPanel: false,
        matchingSeeds
      });
    }
    get().updateURL();
  },
  setNightlord: (nightlord) => {
    const state = get();
    let newArray = [...state.urlArray];
    const nightlordPart = `nightlord=${nightlord}`;
    newArray = newArray.filter(part => !part.startsWith('nightlord='));
    newArray.push(nightlordPart);
    const newHistory = [...state.urlHistory.slice(0, state.urlHistoryIndex + 1), newArray];
    const newObject = arrayToObject(newArray);
    const matchingSeeds = searchSeeds({
      mapType: newObject.mapType!,
      slots: newObject.slots,
      nightlord: newObject.nightlord
    });
    let currentPhase = state.currentPhase;
    if (matchingSeeds.length === 1 && !newObject.foundSeed) {
      newArray.push(`SEED=${matchingSeeds[0].seed_id}`);
      const finalObject = arrayToObject(newArray);
      currentPhase = 'complete';
      const finalHistory = [...newHistory, newArray];
      set({
        mapType: finalObject.mapType as MapType,
        slots: finalObject.slots,
        nightlord: finalObject.nightlord as NightlordType,
        foundSeed: finalObject.foundSeed,
        urlArray: newArray,
        urlHistory: finalHistory,
        urlHistoryIndex: finalHistory.length - 1,
        currentPhase,
        activeSlot: null,
        activeBuildingPanel: false,
        matchingSeeds
      });
      get().logResult(matchingSeeds[0].seed_id);
    } else {
      set({
        mapType: newObject.mapType as MapType,
        slots: newObject.slots,
        nightlord: newObject.nightlord as NightlordType,
        foundSeed: newObject.foundSeed,
        urlArray: newArray,
        urlHistory: newHistory,
        urlHistoryIndex: newHistory.length - 1,
        currentPhase,
        activeSlot: null,
        activeBuildingPanel: false,
        matchingSeeds
      });
    }
    get().updateURL();
  },
  setFoundSeed: (seedId) => {
    const state = get();
    let newArray = [...state.urlArray];
    const seedPart = `SEED=${seedId}`;
    newArray = newArray.filter(part => !part.startsWith('SEED='));
    newArray.push(seedPart);
    const newHistory = [...state.urlHistory.slice(0, state.urlHistoryIndex + 1), newArray];
    const newObject = arrayToObject(newArray);
    set({
      mapType: newObject.mapType as MapType,
      slots: newObject.slots,
      nightlord: newObject.nightlord as NightlordType,
      foundSeed: newObject.foundSeed,
      urlArray: newArray,
      urlHistory: newHistory,
      urlHistoryIndex: newHistory.length - 1,
      currentPhase: 'complete',
      activeSlot: null,
      activeBuildingPanel: false
    });
    get().updateURL();
    if (seedId) {
      get().logResult(seedId);
    }
  },
  setActiveSlot: (slotId) => {
    set({
      activeSlot: slotId,
      activeBuildingPanel: !!slotId
    });
  },
  setActiveBuildingPanel: (active) => {
    set({
      activeBuildingPanel: active,
      activeSlot: active ? get().activeSlot : null
    });
  },
  getUndoPreview: () => {
    const state = get();
    if (state.urlHistoryIndex <= 0) {
      return;
    }
    const stepsBack = state.currentPhase === 'complete' ? 2 : 1;
    const targetIndex = Math.max(0, state.urlHistoryIndex - stepsBack);
    const currentArray = state.urlArray;
    const previousArray = state.urlHistory[targetIndex];
    state.urlHistory.forEach((historyArray, index) => {
      })
    const removedParts = currentArray.filter(part => !previousArray.includes(part));
    const addedParts = previousArray.filter(part => !currentArray.includes(part));
    if (removedParts.length > 0) {
      }
    if (addedParts.length > 0) {
      }
    },
  undo: () => {
    const state = get();
    if (state.urlHistoryIndex > 0) {
      const stepsBack = state.currentPhase === 'complete' ? 2 : 1;
      const targetIndex = Math.max(0, state.urlHistoryIndex - stepsBack);
      const previousArray = state.urlHistory[targetIndex];
      const newObject = arrayToObject(previousArray);
      const matchingSeeds = newObject.mapType ? searchSeeds({
        mapType: newObject.mapType,
        slots: newObject.slots,
        nightlord: newObject.nightlord
      }) : [];
      const newPhase = newObject.foundSeed ? 'complete' : newObject.mapType ? 'building' : 'selection';
      set({
        mapType: newObject.mapType as MapType,
        slots: newObject.slots,
        nightlord: newObject.nightlord as NightlordType,
        foundSeed: newObject.foundSeed,
        urlArray: [...previousArray],
        urlHistoryIndex: targetIndex,
        currentPhase: newPhase,
        activeSlot: null,
        activeBuildingPanel: false,
        matchingSeeds
      });
      get().updateURL();
      setTimeout(() => {
        set({});
      }, 10);
    } else {
      }
  },
  restart: () => {
    const currentState = get()
    set({
      mapType: null,
      slots: {},
      nightlord: null,
      foundSeed: null,
      urlArray: [],
      urlHistory: [[]],
      urlHistoryIndex: 0,
      currentPhase: 'selection',
      activeSlot: null,
      activeBuildingPanel: false,
      matchingSeeds: [],
      _isInternalURLUpdate: false
    });
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/');
    }
    const newState = get()
    setTimeout(() => {
      set({ currentPhase: 'selection' });
    }, 10);
  },
  syncFromURL: (urlState, originalArray?) => {
    const state = get();
    if (state._isInternalURLUpdate) {
      return;
    }
    const initialArray = originalArray || objectToArray(urlState);
    const arrayHistory: string[][] = [[]];
    for (let i = 0; i < initialArray.length; i++) {
      const currentArray = initialArray.slice(0, i + 1);
      arrayHistory.push(currentArray);
    }
    arrayHistory.forEach((historyArray, index) => {
      })
    const matchingSeeds = urlState.mapType ? searchSeeds({
      mapType: urlState.mapType,
      slots: urlState.slots,
      nightlord: urlState.nightlord
    }) : [];
    if (matchingSeeds.length === 1 && !urlState.foundSeed) {
      const autoSeed = matchingSeeds[0].seed_id;
      initialArray.push(`SEED=${autoSeed}`);
      arrayHistory.push(initialArray.slice());
      urlState.foundSeed = autoSeed;
    }
    const newPhase = urlState.foundSeed ? 'complete' : urlState.mapType ? 'building' : 'selection';
    set({
      mapType: urlState.mapType as MapType,
      slots: urlState.slots,
      nightlord: urlState.nightlord as NightlordType,
      foundSeed: urlState.foundSeed,
      urlArray: initialArray,
      urlHistory: arrayHistory,
      urlHistoryIndex: arrayHistory.length - 1,
      currentPhase: newPhase,
      activeSlot: null,
      activeBuildingPanel: false,
      matchingSeeds
    });
  },
  updateURL: () => {
    if (typeof window !== 'undefined') {
      const state = get();
      const newPath = arrayToURL(state.urlArray);
      set({ _isInternalURLUpdate: true });
      window.history.replaceState({}, '', newPath);
      setTimeout(() => {
        set({ _isInternalURLUpdate: false });
      }, 50);
    }
  },
  logResult: (seedId) => {
    const state = get();
    if (state.loggedSeeds.includes(seedId)) {
      return;
    }
    set({ loggedSeeds: [...state.loggedSeeds, seedId] });
    const sessionDuration = Math.floor((Date.now() - state.sessionStartTime) / 1000);
    const pathTaken = state.urlHistory.slice(0, state.urlHistoryIndex + 1);
    const logData = {
      seed_id: seedId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bug_report: false,
      session_duration: sessionDuration,
      additional_info: { map_type: state.mapType },
      path_taken: pathTaken,
    };
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    }).catch(() => {});
    set({ sessionStartTime: Date.now() });
  }
}));