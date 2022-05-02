import { getYjsValue, syncedStore } from '@syncedstore/core';
import { useSyncedStore } from '@syncedstore/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { WebRTCProviderClient } from '@/components/WebRTC';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { S4 } from '@/utils/Helpers';

const Room = () => {
  const router = useRouter();
  const roomName = (router.query.name as string) || `room_${S4()}`;

  // Team state for the current room
  const teamStore = syncedStore({ team: [] as Pokemon[] });

  // Create a document that syncs automatically using Y-WebRTC
  const teamDoc = getYjsValue(teamStore);
  const teamState = useSyncedStore(teamStore);
  const [tab, setTab] = useState<number>(7);

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Pikachu'));
    setTab(newLen - 1);
  };

  const removeTab = (index: number) => {
    teamState.team.splice(index, 1);
  };

  return (
    <Main title={`Room - ${roomName}`}>
      <WebRTCProviderClient roomName={roomName} doc={teamDoc}>
        <div className="tabs">
          {teamState.team.map((p, i) => (
            <div key={p.id} className="indicator">
              <span className="badge indicator-item badge-primary" onClick={() => removeTab(i)}>
                ×
              </span>
              <a className={`tab tab-lifted tab-lg ${i === tab ? 'tab-active' : ''}`} onClick={() => setTab(i)}>
                {p.species}
              </a>
            </div>
          ))}
          <a className="tab tab-lifted tab-active tab-lg" onClick={() => newTab()}>
            +
          </a>
        </div>
        <div className="mockup-window border bg-base-300">
          {tab >= 0 && tab < teamState.team.length ? (
            <div className="flex justify-center bg-base-200 px-4 py-16">{JSON.stringify(teamState.team[tab])}</div>
          ) : (
            <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon {tab}</div>
          )}
        </div>
      </WebRTCProviderClient>
    </Main>
  );
};

export default Room;
