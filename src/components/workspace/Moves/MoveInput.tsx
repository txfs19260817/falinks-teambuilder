import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

function MoveInput({ moveIdx }: { moveIdx: number }) {
  const { t } = useTranslation(['common', 'moves']);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [move, setMove] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    setMove(t(getPokemonTranslationKey(pm?.moves[moveIdx] || '', 'moves')));
  }, [teamState.getPokemonInTeam(tabIdx)?.moves[moveIdx], teamState.forceRerender.moves[tabIdx]?.[moveIdx]]);

  const thisFocusedFieldState: FocusedFieldToIdx = { Moves: moveIdx };
  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMove = e.target.value;
    setGlobalFilter(newMove); // set search words to filter table
    setMove(newMove); // set the value of input
  };

  const handleFocus = () => {
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>
        {t('common.move')} {moveIdx + 1}
      </span>
      <input
        type="search"
        placeholder={t('common.move')}
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={move}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default MoveInput;
