import { TourProvider } from '@reactour/tour';
import { syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContextProvider } from '@/components/workspace/Contexts/StoreContext';
import { useFieldAutoChange } from '@/components/workspace/FocusedField';
import Overview, { OverviewTabBtn } from '@/components/workspace/Overview';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import TabsSwitcher from '@/components/workspace/Tabs/TabsSwitcher';
import Toolbox from '@/components/workspace/Toolbox';
import { HistoryDialog } from '@/components/workspace/Toolbox/HistoryDialog';
import { ImportShowdownDialog } from '@/components/workspace/Toolbox/ImportShowdown';
import { NotesDialog } from '@/components/workspace/Toolbox/Notes';
import { PostPokepasteDialog } from '@/components/workspace/Toolbox/PostPokepaste';
import { Client, ClientInfo } from '@/models/Client';
import { Pokemon } from '@/models/Pokemon';
import { Metadata, StoreContextType, TeamChangelog, TeamState } from '@/models/TeamState';
import { getProvidersByProtocolName, SupportedProtocolProvider } from '@/providers';
import { BaseProvider } from '@/providers/baseProviders';
import { AppConfig, roomTourSteps } from '@/utils/AppConfig';
import type { BasePokePaste } from '@/utils/Types';

export type WorkspaceProps = {
  protocolName: SupportedProtocolProvider;
  roomName: string;
  basePokePaste?: BasePokePaste;
};

const teamStore = syncedStore<StoreContextType>({
  metadata: {} as Metadata,
  team: [] as Pokemon[],
  notes: 'xml',
  history: [] as TeamChangelog[],
});

function Workspace({ roomName, protocolName, basePokePaste }: WorkspaceProps) {
  // States
  const [client, setClient] = useState<Client | undefined>();
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [focusedFieldState, focusedFieldDispatch] = useFieldAutoChange({
    Species: 0,
  });

  // Initialize synced store
  // Only `teamState` in this level is instance of MappedTypeDescription.
  // Its children are instances of class TeamState.
  const teamState = useSyncedStore(teamStore);
  if (teamState.metadata.roomName !== roomName) {
    teamState.metadata.roomName = roomName;
  }
  if (teamState.metadata.title?.length === 0) {
    teamState.metadata.title = roomName;
  }
  if (teamState.metadata.format?.length === 0) {
    teamState.metadata.format = AppConfig.defaultFormat;
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
    // add a listener to update members in this room
    providerInstance.awareness.on(
      'change',
      ({ added, removed }: { added: Array<any>; updated: Array<any>; removed: Array<any> }, origin: BaseProvider | 'local') => {
        if (!origin) return;
        if (origin === 'local') {
          // it can be 'local' when the client is initialized
          teamState.metadata.authors = [localStorage.getItem('username') || 'Trainer'];
          return;
        }
        if (origin.awareness) {
          // connected with others, update members to metadata
          const membersMap = origin.awareness.getStates();
          teamState.metadata.authors = Array.from(membersMap.values() as Iterable<ClientInfo>).map((c) => c.user.name);
          // show a notification if someone joined/leaved
          if (added.length > 0) {
            toast(`${(membersMap.get(added[0]) as ClientInfo)?.user?.name || 'A trainer'} (${added[0]}) joined the room, welcome!`, {
              icon: '👏',
              position: 'bottom-right',
            });
          }
          if (removed.length > 0) {
            toast(`A trainer (${removed[0]}) left the room, bye!`, {
              icon: '👋',
              position: 'bottom-right',
            });
          }
        }
      }
    );

    // Disconnect on unmount
    return () => {
      providers.disconnectByRoomName(roomName);
    };
  }, []);

  // Set up base Pokémon if a PokePaste link is provided
  useEffect(() => {
    if (!basePokePaste) return;
    const baseTeam = Pokemon.convertPasteToTeam(basePokePaste.paste) ?? undefined;
    const { title, author, notes } = basePokePaste;
    if (baseTeam) {
      teamState.team.splice(0, teamState.team.length);
      teamState.team.push(...baseTeam);
      teamState.metadata.title = title && title.length > 0 ? title : roomName;
      teamState.metadata.notes = notes;
      teamState.metadata.authors = [author ?? 'Trainer'];
    }
  }, [basePokePaste]);

  return (
    <TourProvider steps={roomTourSteps}>
      <StoreContextProvider
        value={{
          teamState: new TeamState(teamState),
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
        {client && (
          <>
            <ImportShowdownDialog />
            <HistoryDialog />
            <PostPokepasteDialog />
            <NotesDialog store={teamStore} client={client} />
          </>
        )}
      </StoreContextProvider>
    </TourProvider>
  );
}

export default Workspace;
