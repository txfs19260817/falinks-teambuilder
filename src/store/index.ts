import { getYjsValue, syncedStore } from '@syncedstore/core';

import { Pokemon } from '@/models/Pokemon';

// type RoomAttributes = { name: string };

export const teamStore = syncedStore({
  team: [] as Pokemon[],
  // roomAttributes: {} as RoomAttributes,
});

// Create a document that syncs automatically using Y-WebRTC
export const teamDoc = getYjsValue(teamStore);
