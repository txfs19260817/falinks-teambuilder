import { MappedTypeDescription } from '@syncedstore/core/types/doc';

import { StoreContextType } from '@/components/workspace/Contexts/StoreContext';

type BaseProvider = {
  connect: () => void;
  disconnect: () => void;
};

export abstract class Providers<T extends BaseProvider> {
  protected providers: Map<string, T> = new Map();

  public abstract getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): T;

  // eslint-disable-next-line class-methods-use-this
  public connectByProvider(provider: BaseProvider): void {
    provider.connect();
  }

  public disconnectByRoomName(roomName: string): void {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebsocketProvider first`);
    }
    provider.disconnect();
  }
}
