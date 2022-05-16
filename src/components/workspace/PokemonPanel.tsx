import { GenerationNum, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { Data } from '@pkmn/dex-types';
import { useState } from 'react';

import AbilityInput from '@/components/workspace/Abilities/AbilityInput';
import AttributeSetterSwitch from '@/components/workspace/AttributeSetterSwitch';
import { DexContextProvider } from '@/components/workspace/DexContext';
import GenderPicker from '@/components/workspace/Gender/GenderPicker';
import GMaxSwitch from '@/components/workspace/GMax/GMaxSwitch';
import ItemInput from '@/components/workspace/Items/ItemInput';
import LevelSetter from '@/components/workspace/Level/LevelSetter';
import MoveInput from '@/components/workspace/Moves/MoveInput';
import NicknameInput from '@/components/workspace/Nickname/NicknameInput';
import SpeciesInput from '@/components/workspace/PokemonSpecies/SpeciesInput';
import ShinyToggle from '@/components/workspace/Shiny/ShinyToggle';
import SpriteAvatar from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import StatsClickable from '@/components/workspace/Stats/StatsClickable';
import { AppConfig } from '@/utils/AppConfig';
// TODO: 1. auto move to next input when input is filled

const gen = new Generations(Dex, (d: Data) => {
  if (!d.exists) return false;
  if ('isNonstandard' in d && d.isNonstandard) return d.isNonstandard === 'Gigantamax';
  if (d.kind === 'Ability' && d.id === 'noability') return false;
  return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
}).get(AppConfig.defaultGen as GenerationNum);

const PokemonPanel = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  return (
    <DexContextProvider value={{ gen, globalFilter, setGlobalFilter }}>
      <div className="mockup-window border bg-base-300">
        <div className="grid grid-cols-4 grid-rows-2 gap-y-2 gap-x-1 bg-base-200 py-2 px-1">
          {/* 1. Nickname & Species */}
          <div aria-label="species" className="form-control justify-between">
            {/* Nickname */}
            <NicknameInput />
            {/* Sprite */}
            <SpriteAvatar />
            {/* Species */}
            <SpeciesInput />
          </div>
          {/* 2. Misc */}
          <div aria-label="misc" className="form-control justify-between">
            {/* Level */}
            <LevelSetter />
            {/* Gender */}
            <GenderPicker />
            {/* Shiny & Gigantamax */}
            <div className="flex">
              <ShinyToggle />
              <GMaxSwitch />
            </div>
            {/* Item */}
            <ItemInput />
            {/* Ability */}
            <AbilityInput />
          </div>
          {/* 3. Moves */}
          <div aria-label="moves" className="form-control justify-between">
            {[0, 1, 2, 3].map((i) => (
              <MoveInput key={i} moveIdx={i} />
            ))}
          </div>
          {/* 4. Stats */}
          <div aria-label="stats" className="form-control justify-start">
            <StatsClickable />
          </div>
          {/* 5. Lower part */}
          <div className="col-start-1 col-end-5 max-h-52 overflow-y-auto border-2 md:max-h-72">
            <AttributeSetterSwitch />
          </div>
        </div>
      </div>
    </DexContextProvider>
  );
};

PokemonPanel.whyDidYouRender = false;

export { PokemonPanel };
