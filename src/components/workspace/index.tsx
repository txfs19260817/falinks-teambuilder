import { getYjsValue, syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import React, { useEffect, useState } from 'react';
import { WebrtcProvider } from 'y-webrtc';

import { PokemonPanel } from '@/components/workspace/PokemonPanel';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';

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

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Pikachu'));
    setTabIdx(newLen - 1);
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
    <>
      {/* Tab header */}
      <div className="tabs tabs-boxed">
        {teamState.team.map((p, i) => (
          <div key={p.id} className="indicator">
            <span className="badge indicator-item badge-secondary" onClick={() => removeTab(i)}>
              ×
            </span>
            <a className={`tab tab-lifted tab-lg ${i === tabIdx ? 'tab-active' : ''}`} onClick={() => setTabIdx(i)}>
              {p.species}
            </a>
          </div>
        ))}
        {teamState.team.length < AppConfig.maxPokemonPerTeam && (
          <button className="tab tab-lifted tab-active tab-lg" onClick={() => newTab()}>
            +
          </button>
        )}
      </div>
      {/* Panel */}
      <PokemonPanel tabIdx={tabIdx} teamState={teamState} />
    </>
  );
}

export default Workspace;
