import { syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { Reducer, useEffect, useReducer, useState } from 'react';

import { StoreContextProvider, StoreContextType } from '@/components/workspace/Contexts/StoreContext';
import { Dialogs } from '@/components/workspace/Dialogs';
import Overview, { OverviewTabBtn } from '@/components/workspace/Overview';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import TabsSwitcher from '@/components/workspace/Tabs/TabsSwitcher';
import Toolbox from '@/components/workspace/Toolbox';
import { FocusedField, FocusedFieldAction, FocusedFieldToIdx, Metadata } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';
import { getProvidersByProtocolName, SupportedProtocolProvider } from '@/providers';

export type WorkspaceProps = {
  roomName: string;
  protocolName: SupportedProtocolProvider;
};

const teamStore = syncedStore<StoreContextType>({
  metadata: {} as Metadata,
  team: [] as Pokemon[],
  notes: 'xml',
});

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

function Workspace({ roomName, protocolName }: WorkspaceProps) {
  // Initialize synced store
  const teamState = useSyncedStore(teamStore);

  // States
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [focusedFieldState, focusedFieldDispatch] = useReducer<Reducer<FocusedFieldToIdx, FocusedFieldAction>>(reducer, {
    Species: 0,
  });

  useEffect(() => {
    teamState.metadata.roomName = roomName;
    const providers = getProvidersByProtocolName(protocolName);
    // Connect to the room via WebRTC
    const providerInstance = providers.getOrCreateProvider(roomName, teamStore);
    providers.connectByProvider(providerInstance);

    // Disconnect on unmount
    return () => {
      providers.disconnectByRoomName(roomName);
    };
  }, []);

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
      {/* Toolbox menu bar */}
      <Toolbox />
      {/* Tab header */}
      <TabsSwitcher>
        <OverviewTabBtn />
      </TabsSwitcher>
      {/* <NoteEditor teamStore={teamStore} /> */}
      {/* Pokemon panel */}
      {tabIdx < 0 || tabIdx >= teamState.team.length ? <Overview /> : <PokemonPanel />}
      <Dialogs />
    </StoreContextProvider>
  );
}

export default Workspace;
