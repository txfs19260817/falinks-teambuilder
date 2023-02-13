import AbilityInput from '@/components/workspace/Abilities/AbilityInput';
import FocusedFieldSwitch from '@/components/workspace/FocusedField';
import GenderPicker from '@/components/workspace/Gender/GenderPicker';
import GenMechanism from '@/components/workspace/GenMechanism';
import ItemInput from '@/components/workspace/Items/ItemInput';
import LevelSetter from '@/components/workspace/Level/LevelSetter';
import MoveInput from '@/components/workspace/Moves/MoveInput';
import NicknameInput from '@/components/workspace/Nickname/NicknameInput';
import SpeciesInput from '@/components/workspace/PokemonSpecies/SpeciesInput';
import ShinyToggle from '@/components/workspace/Shiny/ShinyToggle';
import SpriteAvatar from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import StatsClickable from '@/components/workspace/Stats/StatsClickable';

const PokemonPanel = () => {
  return (
    <div className="mockup-window border bg-base-300">
      <div className="flex h-full flex-col gap-1">
        {/* Upper part */}
        <div className="rounded-box grid grid-cols-2 gap-x-1 gap-y-2 bg-base-100 px-2 py-1 md:grid-cols-4">
          {/* 1. Nickname & Species */}
          <div aria-label="species" className="form-control rounded-box justify-between">
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
            {/* Shiny & TeraType */}
            <div className="flex">
              <ShinyToggle />
              <GenMechanism />
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
        </div>
        {/* Lower part */}
        <div className="overflow-y-auto border-2">
          <FocusedFieldSwitch />
        </div>
      </div>
    </div>
  );
};

export { PokemonPanel };
