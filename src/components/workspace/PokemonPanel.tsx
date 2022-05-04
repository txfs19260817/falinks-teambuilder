import { useState } from 'react';

import { GenderPicker } from '@/components/workspace/GenderPicker';
import { LevelSetter } from '@/components/workspace/LevelSetter';
import { PokemonTable } from '@/components/workspace/PokemonTable';
import { ShinyToggle } from '@/components/workspace/ShinyToggle';
import { SpriteAvatar } from '@/components/workspace/SpriteAvatar';
import { FocusedField, PanelProps } from '@/components/workspace/types';

const RenderSwitch = ({ focusedField, tabIdx, teamState }: { focusedField: FocusedField } & PanelProps) => {
  switch (focusedField) {
    case FocusedField.Species:
      return <PokemonTable {...{ tabIdx, teamState }} />;
    default:
      return <>{focusedField}</>;
  }
};

export function PokemonPanel({ tabIdx, teamState }: PanelProps) {
  const [focusedField, setFocusedField] = useState<FocusedField>(FocusedField.Species);
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
            <input
              type="text"
              placeholder="Species"
              className="input-primary input input-sm md:input-md"
              onFocus={() => setFocusedField(FocusedField.Species)}
            />
          </label>
        </div>
        {/* 2. Misc */}
        <div aria-label="misc" className="form-control justify-between">
          {/* Level */}
          <LevelSetter {...{ tabIdx, teamState }} />
          {/* Gender */}
          <GenderPicker {...{ tabIdx, teamState }} />
          {/* Shiny */}
          <ShinyToggle {...{ tabIdx, teamState }} />
          {/* Item */}
          <label className="input-group-xs input-group input-group-vertical md:input-group-md">
            <span>Item</span>
            <input type="text" placeholder="Item" className="input-bordered input input-xs md:input-md" onFocus={() => setFocusedField(FocusedField.Item)} />
          </label>
          {/* Ability */}
          <label className="input-group-xs input-group input-group-vertical md:input-group-md">
            <span>Ability</span>
            <input
              type="text"
              placeholder="Ability"
              className="input-bordered input input-xs md:input-md"
              onFocus={() => setFocusedField(FocusedField.Ability)}
            />
          </label>
        </div>
        {/* 3. Moves */}
        <div aria-label="moves" className="form-control justify-between">
          {[1, 2, 3, 4].map((i) => (
            <label key={i} className="input-group-xs input-group input-group-vertical">
              <span>Moves {i}</span>
              <input
                type="text"
                placeholder={`Move ${i}`}
                className="input-bordered input input-sm md:input-md"
                onFocus={() => setFocusedField(FocusedField.Moves)}
              />
            </label>
          ))}
        </div>
        {/* 4. Status */}
        <div aria-label="status" className="form-control justify-start">
          <label
            className="input-group-md input-group input-group-vertical rounded-lg border border-base-300 transition-all hover:opacity-80 hover:shadow-xl md:input-group-lg"
            onClick={() => setFocusedField(FocusedField.Stats)}
          >
            <span>Status</span>
            {Object.entries({
              hp: 6,
              atk: 120,
              def: 0,
              spa: 120,
              spd: 0,
              spe: 252,
            }).map(([key, value]) => (
              <div key={key} className="flex flex-wrap items-center justify-between bg-base-100 px-1 hover:bg-base-200 md:py-1">
                <label className="flex-none uppercase md:w-10">{key}: </label>
                <meter className="w-full flex-1" min="0" max="252" low={100} high={200} optimum={252} value={value} title={`${value}`} />
              </div>
            ))}
          </label>
        </div>
        <div className="col-start-1 col-end-5 max-h-52 overflow-y-scroll border-2 md:max-h-72">
          <RenderSwitch {...{ focusedField, tabIdx, teamState }} />
        </div>
      </div>
    </div>
  );
}
