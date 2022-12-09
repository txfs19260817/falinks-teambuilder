import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

function SpeciesInput() {
  const { t } = useTranslation(['common', 'species']);
  // `setGlobalFilter` makes it possible to filter table by typing in <input />
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);

  const [species, setSpecies] = useState('');

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    setSpecies(t(getPokemonTranslationKey(pm?.species || '', 'species')));
  }, [teamState.getPokemonInTeam(tabIdx)?.species, teamState.forceRerender.species[tabIdx]]);

  const thisFocusedFieldState: FocusedFieldToIdx = { Species: 0 };
  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSpecies = e.target.value;
    setGlobalFilter(newSpecies); // set search words to filter table
    setSpecies(newSpecies); // set the value of input
  };

  const handleFocus = () => {
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>{t('common.pokemon')}</span>
      <input
        type="search"
        placeholder={t('common.pokemon')}
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={species}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default SpeciesInput;
