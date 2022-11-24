import { getYjsValue } from '@syncedstore/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { WebsocketProvider } from 'y-websocket';

import { StoreContextType } from '@/models/TeamState';
import { Providers } from '@/providers/baseProviders';

const serverUrl = 'wss://falinks-teambuilder-ws-server.onrender.com';

let instance: WebsocketProviders;

class WebsocketProviders extends Providers<WebsocketProvider> {
  constructor() {
    super();
    if (instance) {
      throw new Error('You can only create one instance!');
    }

    instance = this;
  }

  public getOrCreateProvider(roomName: string, store: MappedTypeDescription<StoreContextType>): WebsocketProvider {
    if (!this.providers.has(roomName)) {
      this.providers.set(roomName, new WebsocketProvider(serverUrl, roomName, getYjsValue(store) as any));
    }

    return this.providers.get(roomName)!;
  }
}

const singletonWebsocketProviders = Object.freeze(new WebsocketProviders());

export { singletonWebsocketProviders };
