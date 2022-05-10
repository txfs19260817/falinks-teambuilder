import { Dispatch, SetStateAction } from 'react';

import { AbilitiesTable, AbilityInput } from '@/components/workspace/AbilitiesTable';
import { EvsSliders, StatsClickable } from '@/components/workspace/EvsSliders';
import { GenderPicker } from '@/components/workspace/GenderPicker';
import { GmaxToggle } from '@/components/workspace/GmaxToggle';
import { ItemInput, ItemsTable } from '@/components/workspace/ItemsTable';
import { LevelSetter } from '@/components/workspace/LevelSetter';
import { MoveInput, MovesTable } from '@/components/workspace/MovesTable';
import { NicknameInput } from '@/components/workspace/NicknameInput';
import { PokemonTable, SpeciesInput } from '@/components/workspace/PokemonTable';
import { ShinyToggle } from '@/components/workspace/ShinyToggle';
import { SpriteAvatar } from '@/components/workspace/SpriteAvatar';
import { FocusedField, FocusedFieldToIdx, PanelProps } from '@/components/workspace/types';

const RenderSwitch = ({ focusedField, tabIdx, teamState }: { focusedField: FocusedFieldToIdx } & PanelProps) => {
  const firstEntry = Object.entries(focusedField)[0];
  const [field, idx] = firstEntry ?? ['', 0];
  switch (field) {
    case FocusedField.Species:
      return <PokemonTable {...{ tabIdx, teamState }} />;
    case FocusedField.Item:
      return <ItemsTable {...{ tabIdx, teamState }} />;
    case FocusedField.Ability:
      return <AbilitiesTable {...{ tabIdx, teamState }} />;
    case FocusedField.Moves:
      return <MovesTable {...{ tabIdx, teamState }} moveIdx={idx} />;
    case FocusedField.Stats:
      return <EvsSliders {...{ tabIdx, teamState }} />;
    default:
      return null;
  }
};

const PokemonPanel = ({
  focusedField,
  setFocusedField,
  tabIdx,
  teamState,
}: {
  focusedField: FocusedFieldToIdx;
  setFocusedField: Dispatch<SetStateAction<FocusedFieldToIdx>>;
} & PanelProps) => {
  if (tabIdx < 0 || tabIdx >= teamState.team.length) {
    return <div className="flex justify-center bg-base-200 px-4 py-16">Please create / select a Pokemon</div>;
  }

  return (
    <div className="mockup-window border bg-base-300">
      <div className="grid grid-cols-4 grid-rows-2 gap-y-2 gap-x-1 bg-base-200 py-2 px-1">
        {/* 1. Nickname & Species */}
        <div aria-label="species" className="form-control justify-between">
          {/* Nickname */}
          <NicknameInput {...{ tabIdx, teamState }} />
          {/* Sprite */}
          <SpriteAvatar {...{ tabIdx, teamState }} />
          {/* Species */}
          <SpeciesInput
            onFocus={() =>
              setFocusedField({
                Species: 0,
              })
            }
            {...{ tabIdx, teamState }}
          />
        </div>
        {/* 2. Misc */}
        <div aria-label="misc" className="form-control justify-between">
          {/* Level */}
          <LevelSetter {...{ tabIdx, teamState }} />
          {/* Gender */}
          <GenderPicker {...{ tabIdx, teamState }} />
          {/* Shiny & Gigantamax */}
          <div className="flex">
            <ShinyToggle {...{ tabIdx, teamState }} />
            <GmaxToggle {...{ tabIdx, teamState }} />
          </div>
          {/* Item */}
          <ItemInput
            onFocus={() =>
              setFocusedField({
                Item: 0,
              })
            }
            {...{ tabIdx, teamState }}
          />
          {/* Ability */}
          <AbilityInput
            onFocus={() =>
              setFocusedField({
                Ability: 0,
              })
            }
            {...{ tabIdx, teamState }}
          />
        </div>
        {/* 3. Moves */}
        <div aria-label="moves" className="form-control justify-between">
          {[0, 1, 2, 3].map((i) => (
            <MoveInput
              key={i}
              moveIdx={i}
              onFocus={() =>
                setFocusedField({
                  Moves: i,
                })
              }
              {...{ tabIdx, teamState }}
            />
          ))}
        </div>
        {/* 4. Stats */}
        <div aria-label="status" className="form-control justify-start">
          <StatsClickable
            onFocus={() =>
              setFocusedField({
                Stats: 0,
              })
            }
            {...{ tabIdx, teamState }}
          />
        </div>
        {/* 5. Lower part */}
        <div className="col-start-1 col-end-5 max-h-52 overflow-y-auto border-2 md:max-h-72">
          <RenderSwitch {...{ focusedField, tabIdx, teamState }} />
        </div>
      </div>
    </div>
  );
};

PokemonPanel.whyDidYouRender = false;

export { PokemonPanel };
