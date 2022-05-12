import { syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { useEffect, useState } from 'react';

import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import { StoreContextProvider, StoreContextType } from '@/components/workspace/StoreContext';
import TabsSwitcher from '@/components/workspace/TabsSwitcher';
import { FocusedFieldToIdx } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';
import WebrtcProviders from '@/store/webrtcProviders';

export type WebRTCProviderProps = {
  roomName: string;
};

const teamStore = syncedStore<StoreContextType>({ team: [] as Pokemon[] });

function Workspace({ roomName }: WebRTCProviderProps) {
  // Initialize synced store
  const teamState = useSyncedStore(teamStore);

  // States
  const [connected, setConnected] = useState(false);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<FocusedFieldToIdx>({
    Species: 0,
  });

  useEffect(() => {
    // Connect to the room via WebRTC
    const webrtcProvider = WebrtcProviders.getOrCreateProvider(roomName, teamStore);
    WebrtcProviders.connectByProvider(webrtcProvider);
    setConnected(true);

    // Disconnect on unmount
    return () => {
      WebrtcProviders.disconnectByRoomName(roomName);
      setConnected(false);
    };
  }, []);

  if (!connected) {
    return <h1>Connecting...</h1>;
  }

  return (
    <StoreContextProvider value={{ teamState, tabIdx, setTabIdx, focusedField, setFocusedField }}>
      {/* Tab header */}
      <TabsSwitcher />
      {/* Panel */}
      {tabIdx < 0 || tabIdx >= teamState.team.length ? (
        <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon</div>
      ) : (
        <PokemonPanel />
      )}
    </StoreContextProvider>
  );
}

Workspace.whyDidYouRender = false;

export default Workspace;
