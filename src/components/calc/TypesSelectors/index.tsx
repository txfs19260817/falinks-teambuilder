import { TypeName } from '@pkmn/data';
import { ChangeEvent, memo } from 'react';

import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import { typesWithEmoji } from '@/utils/PokemonUtils';

const TypesSelectors = memo(
  ({
    types,
    onChangeType1,
    onChangeType2,
  }: {
    types: [TypeName] | [TypeName, TypeName];
    onChangeType1: (e: ChangeEvent<HTMLSelectElement>) => void;
    onChangeType2: (e: ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <>
      <label className="input-group-xs input-group">
        <span className="input-addon w-28 border border-neutral">Type1</span>
        <ValueWithEmojiSelector options={typesWithEmoji} bindValue={types[0]} className="select-bordered select-xs w-1/3 xl:w-1/2" onChange={onChangeType1} />
      </label>
      <label className="input-group-xs input-group">
        <span className="input-addon w-28 border border-neutral">Type2</span>
        <ValueWithEmojiSelector
          options={typesWithEmoji}
          bindValue={types[1] ?? ''}
          className="select-bordered select-xs w-1/3 xl:w-1/2"
          emptyOption="(None)"
          onChange={onChangeType2}
        />
      </label>
    </>
  )
);
TypesSelectors.displayName = 'TypesSelectors';

export { TypesSelectors };
