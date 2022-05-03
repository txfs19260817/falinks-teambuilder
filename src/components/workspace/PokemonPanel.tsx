import { Sprites } from '@pkmn/img';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { ChangeEvent, useEffect, useState } from 'react';

import { Pokemon } from '@/models/Pokemon';

// enum FocusedField {
//   Species = 'species',
//   Item = 'item',
//   Ability = 'ability',
//   Moves1 = 'moves1',
//   Moves2 = 'moves2',
//   Moves3 = 'moves3',
//   Moves4 = 'moves4',
//   Stats = 'stats',
// }

type PanelProps = {
  tabIdx: number;
  teamState: MappedTypeDescription<{ team: Pokemon[] }>;
};

function ShinyToggle({ tabIdx, teamState }: PanelProps) {
  const [checked, setChecked] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].shiny = newChecked;
  };

  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setChecked(teamState.team[tabIdx]?.shiny || false);
  }, [teamState.team[tabIdx]?.shiny]);

  return (
    <div className="flex space-x-0.5 text-sm lg:text-lg">
      <label>Shiny: </label>
      <div className="whitespace-nowrap">
        <label className="swap swap-flip">
          <input type="checkbox" checked={checked} onChange={(e) => handleChange(e)} />
          <span className="swap-on">🌟</span>
          <span className="swap-off">✖️</span>
        </label>
      </div>
    </div>
  );
}

function SpriteAvatar({ teamState, tabIdx }: PanelProps) {
  const [spriteUrl, setSpriteUrl] = useState('https://api.lorem.space/image/face?hash=64318');
  const pm = teamState.team[tabIdx]!;

  useEffect(() => {
    if (!pm) return;
    const { species, shiny } = pm;
    const { url } = Sprites.getPokemon(species, {
      gen: 8,
      shiny,
      // gender: gender as GenderName,
    });
    setSpriteUrl(url);
  }, [pm, pm.species, pm.shiny]);

  return (
    <div className="avatar flex items-center justify-center py-1">
      <div className="w-48 rounded-xl">
        <img src={spriteUrl} alt="sprite" />
      </div>
    </div>
  );
}

export function PokemonPanel({ tabIdx, teamState }: PanelProps) {
  if (tabIdx < 0 || tabIdx >= teamState.team.length) {
    return <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon</div>;
  }

  return (
    <div className="mockup-window border bg-base-300">
      <div className="grid grid-cols-4 grid-rows-2 gap-y-2 gap-x-1 bg-base-200 py-2 px-1">
        {/* 1. Nickname & Species */}
        <div aria-label="species" className="form-control justify-between">
          {/* Nickname */}
          <input type="text" placeholder="Nickname" className="input-accent input input-xs" />
          {/* Sprite */}
          <SpriteAvatar {...{ tabIdx, teamState }} />
          {/* Species */}
          <label className="input-group-xs input-group input-group-vertical">
            <span>Species</span>
            <input type="text" placeholder="Species" className="input-primary input input-sm md:input-md" />
          </label>
        </div>
        {/* 2. Misc */}
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
          <ShinyToggle {...{ tabIdx, teamState }} />
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
        {/* 3. Moves */}
        <div aria-label="moves" className="form-control justify-between">
          {[1, 2, 3, 4].map((i) => (
            <label key={i} className="input-group-xs input-group input-group-vertical">
              <span>Moves {i}</span>
              <input type="text" placeholder={`Move ${i}`} className="input-bordered input input-sm md:input-md" />
            </label>
          ))}
        </div>
        {/* 4. Status */}
        <div aria-label="status" className="form-control justify-start">
          <label className="input-group-md input-group input-group-vertical rounded-lg border border-base-300 shadow hover:shadow-lg md:input-group-lg">
            <span>Status</span>
            {Object.entries({
              hp: 6,
              atk: 120,
              def: 0,
              spa: 120,
              spd: 0,
              spe: 252,
            }).map(([key, value]) => (
              <div key={key} className="flex flex-wrap items-center justify-between bg-base-100 px-1 md:py-1">
                <label className="flex-none uppercase md:w-10">{key}: </label>
                <meter className="w-full flex-1" min="0" max="252" low={100} high={200} optimum={252} value={value} title={`${value}`} />
              </div>
            ))}
          </label>
        </div>
        <div className="col-start-1 col-end-5 border-2">{JSON.stringify(teamState.team[tabIdx])}</div>
      </div>
    </div>
  );
}
