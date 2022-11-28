import type { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { IndexeddbPersistence } from 'y-indexeddb';
import type { Awareness } from 'y-protocols/awareness';
import type { Doc } from 'yjs';
import { RelativePosition } from 'yjs';

import { StoreContextType } from '@/models/TeamState';
import { getRandomColor } from '@/utils/Helpers';

// provider.awareness.getLocalState() as ClientInfo;
export type ClientInfo = {
  user: {
    color: string;
    name: string;
  };
  cursor: { anchor: RelativePosition; head: RelativePosition };
};

// BaseProvider is an abstraction of yjs providers
export type BaseProvider = {
  connect: () => void;
  disconnect: () => void;
  doc: Doc;
  awareness: Awareness;
};

export abstract class Providers<T extends BaseProvider> {
  protected providers: Map<string, T> = new Map();

  protected indexedDbProviders: Map<string, IndexeddbPersistence> = new Map();

  protected getProviderByRoomName(roomName: string): T {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebsocketProvider or WebrtcProvider first`);
    }
    return provider;
  }

  public disconnectByRoomName(roomName: string): void {
    const provider = this.getProviderByRoomName(roomName);
    if (provider) {
      provider.disconnect();
      this.providers.delete(roomName);
    }
  }

  public abstract getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): T;

  public setUsername(roomName: string, username: string) {
    // You can think of your own awareness information as a key-value store.
    // We update our "user" field to propagate relevant user information.
    this.getProviderByRoomName(roomName).awareness.setLocalStateField('user', {
      // Define a print name that should be displayed
      name: username,
      // Define a color (should be a hex string) that should be associated to the user:
      color: getRandomColor(),
    });
  }

  public enableIndexedDbPersistence(roomName: string): IndexeddbPersistence {
    const provider = this.getProviderByRoomName(roomName);
    const indexedDbPersistence = new IndexeddbPersistence(roomName, provider.doc);
    this.indexedDbProviders.set(roomName, indexedDbPersistence);
    return indexedDbPersistence;
  }

  public disableIndexedDbPersistence(roomName: string): void {
    const indexedDbPersistence = this.indexedDbProviders.get(roomName);
    if (indexedDbPersistence) {
      indexedDbPersistence.destroy();
      this.indexedDbProviders.delete(roomName);
    }
  }
}
