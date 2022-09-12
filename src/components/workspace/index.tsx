import { syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { Reducer, useEffect, useReducer, useState } from 'react';

import { StoreContextProvider, StoreContextType } from '@/components/workspace/Contexts/StoreContext';
import Overview, { OverviewTabBtn } from '@/components/workspace/Overview';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import TabsSwitcher from '@/components/workspace/Tabs/TabsSwitcher';
import Toolbox from '@/components/workspace/Toolbox';
import { ExportShowdownDialog } from '@/components/workspace/Toolbox/ExportShowdown';
import { ImportShowdownDialog } from '@/components/workspace/Toolbox/ImportShowdown';
import { NotesDialog } from '@/components/workspace/Toolbox/Notes';
import { PostPokepasteDialog } from '@/components/workspace/Toolbox/PostPokepaste';
import { FocusedField, FocusedFieldAction, FocusedFieldToIdx, Metadata } from '@/components/workspace/types';
import { Client, ClientInfo } from '@/models/Client';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { getProvidersByProtocolName, SupportedProtocolProvider } from '@/providers';
import { BaseProvider } from '@/providers/baseProviders';

export type WorkspaceProps = {
  protocolName: SupportedProtocolProvider;
  roomName: string;
  basePokePaste?: PokePaste;
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

function Workspace({ roomName, protocolName, basePokePaste }: WorkspaceProps) {
  // States
  const [client, setClient] = useState<Client | undefined>();
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [focusedFieldState, focusedFieldDispatch] = useReducer<Reducer<FocusedFieldToIdx, FocusedFieldAction>>(reducer, {
    Species: 0,
  });

  // Initialize synced store
  const teamState = useSyncedStore(teamStore);
  if (teamState.metadata.roomName !== roomName) {
    teamState.metadata.roomName = roomName;
    teamState.metadata.title = roomName;
  }

  // Set up the connection
  useEffect(() => {
    // set up provider
    const providers = getProvidersByProtocolName(protocolName);
    const providerInstance: BaseProvider = providers.getOrCreateProvider(roomName, teamStore);
    providerInstance.connect();
    // create client
    const clientInstance = new Client(providerInstance, localStorage.getItem('username') || undefined);
    setClient(clientInstance);
    providerInstance.awareness.on('change', (_: any, origin: BaseProvider) => {
      if (origin && origin.awareness)
        teamState.metadata.authors = Array.from(origin.awareness.getStates().values() as Iterable<ClientInfo>).map((c) => c.user.name);
    });

    // Disconnect on unmount
    return () => {
      providers.disconnectByRoomName(roomName);
    };
  }, []);

  // Set up base Pokémon
  useEffect(() => {
    if (!basePokePaste) return;
    const baseTeam = basePokePaste.extractPokemonFromPaste() ?? undefined;
    const { title, author, notes } = basePokePaste;
    if (baseTeam) {
      teamState.team.splice(0, teamState.team.length);
      teamState.team.push(...baseTeam);
      teamState.metadata.title = title;
      teamState.metadata.notes = notes;
      teamState.metadata.authors = [author];
    }

    // remove PokePaste link from URL to allow for sharing
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete('pokepaste');
    url.search = params.toString();
    window.history.replaceState({}, document.title, url.toString());
  }, [basePokePaste]);

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
      {/* Pokemon panel */}
      {tabIdx < 0 || tabIdx >= teamState.team.length ? <Overview /> : <PokemonPanel />}
      {/* Dialogs */}
      <ImportShowdownDialog />
      <ExportShowdownDialog />
      <PostPokepasteDialog />
      {client && <NotesDialog store={teamStore} client={client} />}
    </StoreContextProvider>
  );
}

export default Workspace;
