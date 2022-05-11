import { Icons } from '@pkmn/img';
import { useSyncedStore } from '@syncedstore/react';
import React, { useEffect, useState } from 'react';
import { WebrtcProvider } from 'y-webrtc';

import { DexContextProvider } from '@/components/workspace/DexContext';
import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import { FocusedFieldToIdx } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';
import { teamDoc, teamStore } from '@/store';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

export type WebRTCProviderProps = {
  roomName: string;
};

function Workspace({ roomName }: WebRTCProviderProps) {
  // Connected
  const [connected, setConnected] = useState(false);
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
    setConnected(true);

    return () => {
      setConnected(false);
      webrtcProvider.disconnect();
    };
  }, []);

  if (!connected) {
    return <h1>Connecting...</h1>;
  }

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
      {tabIdx < 0 || tabIdx >= teamState.team.length ? (
        <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon</div>
      ) : (
        <PokemonPanel {...{ focusedField, setFocusedField, tabIdx }} />
      )}
    </DexContextProvider>
  );
}

Workspace.whyDidYouRender = true;

export default Workspace;
