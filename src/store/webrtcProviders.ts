import { getYjsValue } from '@syncedstore/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { WebrtcProvider } from 'y-webrtc';

import { StoreContextType } from '@/components/workspace/StoreContext';

let instance: WebrtcProviders;

class WebrtcProviders {
  private providers: Map<string, WebrtcProvider>;

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!');
    }

    this.providers = new Map();

    instance = this;
  }

  public getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): WebrtcProvider {
    if (!this.providers.has(roomName)) {
      this.providers.set(roomName, new WebrtcProvider(roomName, getYjsValue(store) as any));
    }

    return this.providers.get(roomName)!;
  }

  // eslint-disable-next-line class-methods-use-this
  public connectByProvider(provider: WebrtcProvider): void {
    provider.connect();
  }

  public disconnectByRoomName(roomName: string): void {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebrtcProvider first`);
    }
    provider.disconnect();
  }
}

const singletonWebrtcProviders = Object.freeze(new WebrtcProviders());

export default singletonWebrtcProviders;
