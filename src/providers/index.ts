import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

import { StoreContextType } from '@/components/workspace/Contexts/StoreContext';

type SupportedProviders = WebsocketProvider | WebrtcProvider;

export abstract class Providers {
  protected providers: Map<string, SupportedProviders> = new Map();

  public abstract getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): SupportedProviders;

  // eslint-disable-next-line class-methods-use-this
  public connectByProvider(provider: SupportedProviders): void {
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
