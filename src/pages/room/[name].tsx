import { getYjsValue, syncedStore } from '@syncedstore/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { useSyncedStore } from '@syncedstore/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { WebRTCProviderClient } from '@/components/WebRTC';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { S4 } from '@/utils/Helpers';

function PokemonPanel({ tabIdx, teamState }: { tabIdx: number; teamState: MappedTypeDescription<{ team: Pokemon[] }> }) {
  if (tabIdx < 0 || tabIdx >= teamState.team.length) {
    return <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon {tabIdx}</div>;
  }
  const pokemon = teamState.team[tabIdx];
  return (
    <div className="mockup-window border bg-base-300">
      <div className="grid grid-cols-4 grid-rows-2 gap-y-2 gap-x-1 bg-base-200 py-2 px-1">
        {/* Species */}
        <div aria-label="species" className="form-control justify-between">
          <input type="text" placeholder="Nickname" className="input-accent input input-xs" />
          <div className="avatar flex items-center justify-center py-1">
            <div className="w-48 rounded-xl">
              <img src="https://api.lorem.space/image/face?hash=64318" alt="sprite" />
            </div>
          </div>
          <label className="input-group-xs input-group input-group-vertical">
            <span>Species</span>
            <input type="text" placeholder="Species" className="input-primary input input-sm md:input-md" />
          </label>
        </div>
        {/* Misc */}
        <div aria-label="misc" className="form-control justify-between">
          {/* Level */}
          <div className="flex space-x-0.5 text-sm lg:text-lg">
            <span>Level: </span>
            <input type="number" defaultValue={50} min={0} max={100} className="input input-xs w-full md:input-sm" />
          </div>
          {/* Gender */}
          <div className="flex space-x-0.5 text-sm lg:text-lg">
            <label className="hidden md:block">Gender: </label>
            <label>M</label>
            <input type="radio" name="gender" className="radio radio-sm	md:radio-md" defaultChecked={true} />
            <label>F</label>
            <input type="radio" name="gender" className="radio radio-sm	md:radio-md" />
            <label>U</label>
            <input type="radio" name="gender" className="radio radio-sm	md:radio-md" />
          </div>
          {/* Shiny */}
          <div className="flex space-x-0.5 text-sm lg:text-lg">
            <label>Shiny: </label>
            <div className="whitespace-nowrap">
              <label className="swap swap-flip">
                <input type="checkbox" />
                <span className="swap-on">🌟</span>
                <span className="swap-off">✖️</span>
              </label>
            </div>
          </div>
          {/* Item */}
          <label className="input-group-xs input-group input-group-vertical md:input-group-md">
            <span>Item</span>
            <input type="text" placeholder="Item" className="input-bordered input input-xs md:input-md" />
          </label>
          {/* Ability */}
          <label className="input-group-xs input-group input-group-vertical md:input-group-md">
            <span>Ability</span>
            <input type="text" placeholder="Ability" className="input-bordered input input-xs md:input-md" />
          </label>
        </div>
        {/* Moves */}
        <div aria-label="moves" className="form-control justify-between">
          {[1, 2, 3, 4].map((i) => (
            <label key={i} className="input-group-xs input-group input-group-vertical">
              <span>Moves {i}</span>
              <input type="text" placeholder={`Move ${i}`} className="input-bordered input input-sm md:input-md" />
            </label>
          ))}
        </div>
        {/* Status */}
        <div aria-label="status" className="form-control justify-start">
          <label className="input-group-md input-group input-group-vertical rounded-lg border border-base-300 shadow hover:shadow-lg md:input-group-lg">
            <span>Status</span>
            {Object.entries(pokemon?.evs ?? {}).map(([key, value]) => (
              <div key={key} className="flex flex-wrap items-center justify-between bg-base-100 px-1 md:py-1">
                <label className="flex-none uppercase md:w-10">{key}: </label>
                <meter className="w-full flex-1" min="0" max="252" low={100} high={200} value={value} />
              </div>
            ))}
          </label>
        </div>
        <div className="col-start-1 col-end-5 border-2">{JSON.stringify(teamState.team[tabIdx])}</div>
      </div>
    </div>
  );
}

const Room = () => {
  // max number of Pokémon in a team
  const maxTeamLength = 6;

  // Get the room name from the params
  const router = useRouter();
  const roomName = (router.query.name as string) || `room_${S4()}`;

  // Team state for the current room
  const teamStore = syncedStore({ team: [] as Pokemon[] });

  // Create a document that syncs automatically using Y-WebRTC
  const teamDoc = getYjsValue(teamStore);
  const teamState = useSyncedStore(teamStore);

  // tabIdx controls the current showing Pokémon that is being edited
  const [tabIdx, setTabIdx] = useState<number>(-1);

  useEffect(() => {
    teamState.team.push(
      new Pokemon('Pikachu', '', 'Life Orb', 'Static', [], 'Bold', {
        hp: 6,
        atk: 252,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 252,
      })
    );
  }, []);

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Pikachu'));
    setTabIdx(newLen - 1);
  };

  const removeTab = (index: number) => {
    const newTeam = teamState.team.splice(index, 1);
    setTabIdx(newTeam.length - 1);
  };

  return (
    <Main title={`Room - ${roomName}`}>
      <WebRTCProviderClient roomName={roomName} doc={teamDoc}>
        {/* Tab bar */}
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
          {teamState.team.length < maxTeamLength && (
            <button className="tab tab-lifted tab-active tab-lg" onClick={() => newTab()}>
              +
            </button>
          )}
        </div>
        {/* Panel */}
        <PokemonPanel tabIdx={tabIdx} teamState={teamState} />
      </WebRTCProviderClient>
    </Main>
  );
};

export default Room;
