import React, { useEffect, useState } from 'react';
import { WebrtcProvider } from 'y-webrtc';
import { Doc } from 'yjs';

import { teamDoc } from '@/store';

export type WebRTCProviderProps = {
  roomName?: string;
  doc?: Doc;
  children: React.ReactNode;
};

export class WebRTCProvider {
  webrtcProvider: WebrtcProvider;

  constructor(roomName?: string, doc?: Doc) {
    this.webrtcProvider = new WebrtcProvider(roomName || 'falinks-room', doc || (teamDoc as Doc));
  }

  connect = () => this.webrtcProvider.connect();

  disconnect = () => this.webrtcProvider.disconnect();
}

export function WebRTCProviderClient({ roomName, doc, children }: WebRTCProviderProps) {
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    const webrtcProvider = new WebRTCProvider(roomName, doc);
    webrtcProvider.connect();
    setIsComponentMounted(true);
    return () => {
      webrtcProvider.disconnect();
      setIsComponentMounted(false);
    };
  }, []);

  if (!isComponentMounted) {
    return <>Connecting...</>;
  }

  return <>{children}</>;
}
