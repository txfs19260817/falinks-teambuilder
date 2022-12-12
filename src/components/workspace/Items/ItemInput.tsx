import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

function ItemInput() {
  const { t } = useTranslation(['common', 'items']);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [item, setItem] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    setItem(t(getPokemonTranslationKey(pm?.item || '', 'items')));
  }, [teamState.getPokemonInTeam(tabIdx)?.item, teamState.forceRerender.item[tabIdx]]);

  const thisFocusedFieldState: FocusedFieldToIdx = { Item: 0 };
  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newItem = e.target.value;
    setGlobalFilter(newItem); // set search words to filter table
    setItem(newItem); // set the value of input
  };

  const handleFocus = () => {
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical md:input-group-md">
      <span>{t('common.item')}</span>
      <input
        type="search"
        placeholder={t('common.item')}
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={item}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default ItemInput;
