import { getYjsValue } from '@syncedstore/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { WebrtcProvider } from 'y-webrtc';

import { StoreContextType } from '@/components/workspace/Contexts/StoreContext';
import { Providers } from '@/providers/index';

let instance: WebrtcProviders;

class WebrtcProviders extends Providers {
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

    return this.providers.get(roomName)! as WebrtcProvider;
  }
}

const singletonWebrtcProviders = Object.freeze(new WebrtcProviders());

export default singletonWebrtcProviders;
