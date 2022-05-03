import { getYjsValue } from '@syncedstore/core';
import { WebrtcProvider } from 'y-webrtc';
import { Doc } from 'yjs';

export class WebRTCProvider {
  webrtcProvider: WebrtcProvider;

  constructor(roomName: string, doc: ReturnType<typeof getYjsValue>) {
    this.webrtcProvider = new WebrtcProvider(roomName, doc as Doc);
  }

  connect = () => this.webrtcProvider.connect();

  disconnect = () => this.webrtcProvider.disconnect();
}
