import { Models } from '@rematch/core';
import { locations } from './locations';

export interface RootModel extends Models<RootModel> {
  locations: typeof locations;
}

export const models: RootModel = { locations };