import { observeDeep, syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import { useEffect, useMemo, useState } from 'react';
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
import { Pokemon } from '@/models/Pokemon';
import { StoreContextType, TeamState } from '@/models/TeamState';
import { getProvidersByProtocolName, SupportedProtocolProvider } from '@/providers';
import { BaseProvider, ClientInfo } from '@/providers/baseProviders';
import { AppConfig } from '@/utils/AppConfig';
import { getRandomTrainerName } from '@/utils/PokemonUtils';
import type { BasePokePaste } from '@/utils/Types';
import { IndexedDBTeam } from '@/utils/Types';

export type WorkspaceProps = {
  protocolName: SupportedProtocolProvider;
  roomName: string;
  basePokePaste?: BasePokePaste;
};

function Workspace({ roomName, protocolName, basePokePaste }: WorkspaceProps) {
  // States
  const [provider, setProvider] = useState<BaseProvider | undefined>();
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [focusedFieldState, focusedFieldDispatch] = useFieldAutoChange(
    {
      Species: 0,
    },
    setGlobalFilter
  );

  // Initialize synced store
  const teamStore = useMemo(() => {
    return syncedStore<StoreContextType>({
      metadata: {} as StoreContextType['metadata'],
      team: [] as Pokemon[],
      notes: 'xml',
      history: [] as string[],
    });
  }, []);
  // Only `teamState` in this level is instance of MappedTypeDescription.
  // Its children are instances of class TeamState. See `teamStateInstance` below.
  const teamState = useSyncedStore(teamStore);

  // Set up the connection
  useEffect(() => {
    // set up provider.
    // providers: a Map of room name to provider.
    // provider/providerInstance: the specific provider for this room. It can be either WebSocket or WebRTC atm.
    const providers = getProvidersByProtocolName(protocolName);
    const providerInstance: BaseProvider = providers.getOrCreateProvider(roomName, teamStore);

    /* Allocate resources */
    // establish connection
    providerInstance.connect();

    // save this room to IndexedDB
    const indexedDbPersistence = providers.enableIndexedDbPersistence(roomName);

    // set username to the current provider awareness
    const username = localStorage.getItem('username') || getRandomTrainerName();
    providers.setUsername(roomName, username);

    // configure the provider awareness callbacks
    // a listener that notifies all users when a new user joins/leaves
    const membersChangedListener = ({ added, removed }: { added: Array<any>; updated: Array<any>; removed: Array<any> }, origin: BaseProvider | 'local') => {
      if (!origin) return;
      if (origin === 'local') {
        // it can be a literal 'local' when the room is initialized
        teamState.metadata.authors = [username];
        return;
      }
      if (origin.awareness) {
        // connected with others, update members to metadata
        const membersMap = origin.awareness.getStates() as Map<number, ClientInfo>;
        teamState.metadata.authors = Array.from(membersMap.values()).map((c) => c.user.name);
        // show a notification if someone joined/leaved
        if (added.length > 0) {
          toast(`${membersMap.get(added[0])?.user?.name || 'A trainer'} (${added[0]}) joined the room, welcome!`, {
            icon: '👏',
            position: 'top-right',
          });
        }
        if (removed.length > 0) {
          toast(`A trainer (${removed[0]}) left the room, bye!`, {
            icon: '👋',
            position: 'top-right',
          });
        }
      }
    };
    providerInstance.awareness.on('change', membersChangedListener);

    // configure the document change callbacks
    // a listener that updates the custom properties of the room with species IDs in the IndexedDB
    const teamChangedListener = () => {
      const value: IndexedDBTeam = {
        species: teamState.team.map((p) => p.species),
        format: teamState.metadata.format || AppConfig.defaultFormat,
      };
      // put indexedDB name to 'roomNames' comma-separated string in localStorage after indexedDB is updated
      indexedDbPersistence.set(roomName, JSON.stringify(value)).then((r) => {
        const dbName = r.toString();
        const roomDbNames = localStorage.getItem('roomNames');
        if (roomDbNames) {
          const roomNamesArray = roomDbNames.split(',');
          if (!roomNamesArray.includes(dbName)) {
            localStorage.setItem('roomNames', `${roomDbNames},${dbName}`);
          }
        } else {
          localStorage.setItem('roomNames', dbName);
        }
      });
    };
    const unregisterObserveDeep = observeDeep(teamState, teamChangedListener);

    // set provider to state
    setProvider(providerInstance);

    /* Clean up resources */
    // Disconnect on unmount and release callbacks
    return () => {
      unregisterObserveDeep();
      providers.disableIndexedDbPersistence(roomName);
      providerInstance.awareness.off('change', membersChangedListener);
      providers.disconnectByRoomName(roomName);
    };
  }, []);

  // Set up base Pokémon if a PokePaste link is provided
  useEffect(() => {
    if (!basePokePaste) return;
    const baseTeam = Pokemon.convertPasteToTeam(basePokePaste.paste) ?? undefined;
    const { title, author, notes } = basePokePaste;
    if (baseTeam) {
      teamState.team.splice(0, teamState.team.length, ...baseTeam);
      teamState.metadata.title = title && title.length > 0 ? title : roomName;
      teamState.metadata.notes = notes;
      teamState.metadata.authors = [author ?? 'PokePaste'];
    }
  }, [basePokePaste]);

  const teamStateInstance = useMemo<TeamState>(() => {
    // init metadata
    if (teamState.metadata.roomName !== roomName) {
      teamState.metadata.roomName = roomName;
    }
    if (teamState.metadata.title?.length === 0) {
      teamState.metadata.title = roomName;
    }
    if (teamState.metadata.format?.length === 0) {
      teamState.metadata.format = AppConfig.defaultFormat;
    }
    return new TeamState(teamState, teamStore);
  }, [teamState, teamStore]);

  return (
    <StoreContextProvider
      value={{
        teamState: teamStateInstance,
        tabIdx,
        setTabIdx,
        focusedFieldState,
        focusedFieldDispatch,
        globalFilter,
        setGlobalFilter,
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
      {/* Toolbox dialogs */}
      {provider && (
        <>
          <ImportShowdownDialog />
          <HistoryDialog />
          <PostPokepasteDialog />
          <NotesDialog store={teamStore} provider={provider} user={(provider.awareness.getLocalState() as ClientInfo).user} />
        </>
      )}
    </StoreContextProvider>
  );
}

export default Workspace;
