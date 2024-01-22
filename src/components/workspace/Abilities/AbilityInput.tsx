import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

function AbilityInput() {
  const { t } = useTranslation(['common', 'abilities']);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [ability, setAbility] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    setAbility(t(getPokemonTranslationKey(pm?.ability || '', 'abilities')));
  }, [teamState.getPokemonInTeam(tabIdx)?.ability, teamState.forceRerender.ability[tabIdx]]);

  const thisFocusedFieldState: FocusedFieldToIdx = { Ability: 0 };
  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAbility = e.target.value;
    setGlobalFilter(newAbility); // set search words to filter table
    setAbility(newAbility); // set the value of input
  };

  const handleFocus = () => {
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="join join-vertical">
      <span className="text-sm">{t('common.ability')}</span>
      <input
        type="search"
        placeholder={t('common.ability')}
        className={`input input-primary input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={ability}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default AbilityInput;
