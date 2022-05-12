import { syncedStore } from '@syncedstore/core';

import { Pokemon } from '@/models/Pokemon';

// type RoomAttributes = { name: string };

export const teamStore = syncedStore({
  team: [] as Pokemon[],
  // roomAttributes: {} as RoomAttributes,
});
