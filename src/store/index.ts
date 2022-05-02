import { getYjsValue, syncedStore } from '@syncedstore/core';

import { Pokemon } from '@/models/Pokemon';

export const teamStore = syncedStore({ team: [] as Pokemon[] });

// Create a document that syncs automatically using Y-WebRTC
export const teamDoc = getYjsValue(teamStore);
