import { syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { Reducer, useEffect, useReducer, useState } from 'react';

import { StoreContextProvider, StoreContextType } from '@/components/workspace/Contexts/StoreContext';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import TabsSwitcher from '@/components/workspace/Tabs/TabsSwitcher';
import Toolbox from '@/components/workspace/Toolbox';
import { FocusedField, FocusedFieldAction, FocusedFieldToIdx } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';
import WebrtcProviders from '@/store/webrtcProviders';

export type WebRTCProviderProps = {
  roomName: string;
};

const teamStore = syncedStore<StoreContextType>({ team: [] as Pokemon[] });

function reducer(state: FocusedFieldToIdx, action: FocusedFieldAction) {
  const { type, payload } = action;
  switch (type) {
    case 'set':
      return payload;
    case 'next': {
      const [field, idx] = (Object.entries(state)[0] ?? ['', 0]) as [FocusedField, number]; // idx is only used for switching between moves
      if (field === FocusedField.Species) {
        return { Item: 0 };
      }
      if (field === FocusedField.Item) {
        return { Ability: 0 };
      }
      if (field === FocusedField.Ability) {
        return { Moves: 0 };
      }
      if (field === FocusedField.Moves) {
        if (idx <= 2) {
          return { Moves: idx + 1 };
        }
        return { Stats: 0 };
      }
      return payload;
    }
    default:
      throw new Error();
  }
}

function Workspace({ roomName }: WebRTCProviderProps) {
  // Initialize synced store
  const teamState = useSyncedStore(teamStore);

  // States
  const [connected, setConnected] = useState(false);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [focusedFieldState, focusedFieldDispatch] = useReducer<Reducer<FocusedFieldToIdx, FocusedFieldAction>>(reducer, {
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
    <StoreContextProvider
      value={{
        teamState,
        tabIdx,
        setTabIdx,
        focusedFieldState,
        focusedFieldDispatch,
      }}
    >
      {/* Tab header */}
      <TabsSwitcher>
        <Toolbox />
      </TabsSwitcher>
      {/* Pokemon panel */}
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
