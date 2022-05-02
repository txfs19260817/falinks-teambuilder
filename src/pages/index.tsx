import { useSyncedStore } from '@syncedstore/react';
import { useState } from 'react';

import { WebRTCProviderClient } from '@/components/WebRTC';
import { Pokemon } from '@/models/Pokemon';
import { teamStore } from '@/store';
import { Main } from '@/templates/Main';

const Index = () => {
  const teamState = useSyncedStore(teamStore);
  const [tab, setTab] = useState<number>(0);

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Pikachu'));
    setTab(newLen - 1);
  };

  const removeTab = (index: number) => {
    teamState.team.splice(index, 1);
  };

  return (
    <Main title={'Home'}>
      <WebRTCProviderClient>
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

export default Index;
