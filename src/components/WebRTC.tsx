import { getYjsValue } from '@syncedstore/core';
import React, { useEffect, useState } from 'react';
import { WebrtcProvider } from 'y-webrtc';
import { Doc } from 'yjs';

export type WebRTCProviderProps = {
  roomName?: string;
  doc: ReturnType<typeof getYjsValue>;
  children: React.ReactNode;
};

export class WebRTCProvider {
  webrtcProvider: WebrtcProvider;

  constructor(doc: ReturnType<typeof getYjsValue>, roomName?: string) {
    this.webrtcProvider = new WebrtcProvider(roomName || 'falinks-room', doc as Doc);
  }

  connect = () => this.webrtcProvider.connect();

  disconnect = () => this.webrtcProvider.disconnect();
}

export function WebRTCProviderClient({ roomName, doc, children }: WebRTCProviderProps) {
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    const webrtcProvider = new WebRTCProvider(doc, roomName);
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
