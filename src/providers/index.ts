import { Providers } from '@/providers/baseProviders';
import { singletonWebrtcProviders } from '@/providers/webrtcProviders';
import { singletonWebsocketProviders } from '@/providers/websocketProviders';

export const supportedProtocols = ['WebRTC', 'WebSocket'] as const;

export type SupportedProtocolProvider = typeof supportedProtocols[number];
export function getProvidersByProtocolName(protocolName: SupportedProtocolProvider): Readonly<Providers<any>> {
  if (protocolName === 'WebRTC') {
    return singletonWebrtcProviders;
  }
  if (protocolName === 'WebSocket') {
    return singletonWebsocketProviders;
  }
  throw new Error(`Unknown protocol name: ${protocolName}`);
}
