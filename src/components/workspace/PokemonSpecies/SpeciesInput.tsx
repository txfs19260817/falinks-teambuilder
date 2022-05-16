import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';

function SpeciesInput() {
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);

  const [species, setSpecies] = useState('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setSpecies(teamState.team[tabIdx]?.species || '');
  }, [teamState.team[tabIdx]?.species]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSp = e.target.value;
    setGlobalFilter(newSp);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = newSp;
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>Species</span>
      <input
        type="search"
        placeholder="Species"
        className="input-primary input input-sm md:input-md"
        value={species}
        onFocus={() => {
          setGlobalFilter('');
          setFocusedField({ Species: 0 });
        }}
        onChange={handleChange}
      />
    </label>
  );
}

export default SpeciesInput;
