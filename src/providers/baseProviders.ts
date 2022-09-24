import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { Awareness } from 'y-protocols/awareness';

import { StoreContextType } from '@/models/TeamState';

export type BaseProvider = {
  connect: () => void;
  disconnect: () => void;
  awareness: Awareness;
};

export abstract class Providers<T extends BaseProvider> {
  protected providers: Map<string, T> = new Map();

  public abstract getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): T;

  public disconnectByRoomName(roomName: string): void {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebsocketProvider first`);
    }
    provider.disconnect();
  }
}
