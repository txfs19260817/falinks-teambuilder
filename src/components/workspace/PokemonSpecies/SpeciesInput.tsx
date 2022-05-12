import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/StoreContext';

function SpeciesInput() {
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);

  const [species, setSpecies] = useState<string>('Pikachu');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setSpecies(teamState.team[tabIdx]?.species || 'Pikachu');
  }, [teamState.team[tabIdx]?.species]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSp = e.target.value;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = newSp;
  };

  return (
    <div className="tooltip" data-tip="Please pick Pokémon below">
      <label className="input-group-xs input-group input-group-vertical">
        <span>Species</span>
        <input
          type="text"
          placeholder="Species"
          className="input-primary input input-sm md:input-md"
          value={species}
          onFocus={() => setFocusedField({ Species: 0 })}
          onChange={handleChange}
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />
      </label>
    </div>
  );
}

export default SpeciesInput;
