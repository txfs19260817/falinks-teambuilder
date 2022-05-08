import { Icons } from '@pkmn/img';
import { getYjsValue, syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { useEffect, useState } from 'react';
import { WebrtcProvider } from 'y-webrtc';

import { DexContextProvider } from '@/components/workspace/DexContext';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import { FocusedFieldToIdx } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

export type WebRTCProviderProps = {
  roomName: string;
};

function Workspace({ roomName }: WebRTCProviderProps) {
  // Define a team state for the current room
  const teamStore = syncedStore({ team: [] as Pokemon[] });

  // Create a document that syncs automatically using Y-WebRTC
  const teamDoc = getYjsValue(teamStore);
  const teamState = useSyncedStore(teamStore);

  // Tab state and methods
  const [tabIdx, setTabIdx] = useState<number>(0);

  // Panel in the current tab
  const [focusedField, setFocusedField] = useState<FocusedFieldToIdx>({
    Species: 0,
  });

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Bulbasaur'));
    setTabIdx(newLen - 1);
    setFocusedField({
      Species: 0,
    });
  };

  const removeTab = (index: number) => {
    const newTeam = teamState.team.splice(index, 1);
    setTabIdx(newTeam.length - 1);
  };

  useEffect(() => {
    // Connect to the room via WebRTC
    const webrtcProvider = new WebrtcProvider(roomName, teamDoc as any);
    webrtcProvider.connect();

    return () => {
      webrtcProvider.disconnect();
    };
  }, []);

  return (
    <DexContextProvider>
      {/* Tab header */}
      <div className="tabs tabs-boxed">
        {teamState.team.map((p, i) => (
          <div key={p.id} className="indicator">
            <span className="badge indicator-item badge-secondary" onClick={() => removeTab(i)}>
              ×
            </span>
            <a className={`tab tab-lifted tab-md md:tab-lg ${i === tabIdx ? 'tab-active' : ''}`} onClick={() => setTabIdx(i)}>
              <span style={convertStylesStringToObject(Icons.getPokemon(p.species).style)}></span>
              {p.species}
            </a>
          </div>
        ))}
        {teamState.team.length < AppConfig.maxPokemonPerTeam && (
          <button className="tab tab-lifted tab-active tab-md md:tab-lg" onClick={() => newTab()}>
            +
          </button>
        )}
      </div>
      {/* Panel */}
      <PokemonPanel {...{ focusedField, setFocusedField, tabIdx, teamState }} />
    </DexContextProvider>
  );
}

export default Workspace;
