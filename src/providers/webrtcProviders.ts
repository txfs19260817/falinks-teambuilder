import { getYjsValue } from '@syncedstore/core';
import type { MappedTypeDescription } from '@syncedstore/core/types/doc'; // eslint-disable-line import/no-unresolved
import { WebrtcProvider } from 'y-webrtc';

import { StoreContextType } from '@/models/TeamState';
import { Providers } from '@/providers/baseProviders';

let instance: Providers<WebrtcProvider>;

class WebrtcProviders extends Providers<WebrtcProvider> {
  constructor() {
    super();
    if (instance) {
      throw new Error('You can only create one instance!');
    }

    instance = this;
  }

  public getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): WebrtcProvider {
    if (!this.providers.has(roomName)) {
      this.providers.set(roomName, new WebrtcProvider(roomName, getYjsValue(store) as any));
    }

    return this.providers.get(roomName)!;
  }
}

const singletonWebrtcProviders = Object.freeze(new WebrtcProviders());

export { singletonWebrtcProviders };
