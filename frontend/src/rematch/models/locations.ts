import { createModel } from '@rematch/core';
import type { RootModel } from './index';
import type { Location } from '@/src/utils/types';

type LocationState = {
  startLocation: Location | null;
  endLocation: Location | null;
  startModalLocation: { latitude: string; longitude: string; address: string } | null;
  endModalLocation: { latitude: string; longitude: string; address: string } | null;
};

export const locations = createModel<RootModel>()({
  state: {
    startLocation: null,
    endLocation: null,
    startModalLocation: null,
    endModalLocation: null,
  } as LocationState,
  reducers: {
    setStartLocation(state, payload: Location) {
      return { ...state, startLocation: payload, startModalLocation: null };
    },
    setEndLocation(state, payload: Location) {
      return { ...state, endLocation: payload, endModalLocation: null };
    },
    setStartModalLocation(state, payload: { latitude: string; longitude: string; address: string }) {
      return { ...state, startModalLocation: payload, startLocation: null };
    },
    setEndModalLocation(state, payload: { latitude: string; longitude: string; address: string }) {
      return { ...state, endModalLocation: payload, endLocation: null };
    },
    resetLocations() {
      return {
        startLocation: null,
        endLocation: null,
        startModalLocation: null,
        endModalLocation: null,
      };
    },
  },
});