import { ChangeEvent, Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import DexSingleton from '@/models/DexSingleton';

function GenderPicker() {
  const { teamState, tabIdx } = useContext(StoreContext);
  // read specie's gender. If this is not undefined, it means this Pokémon only has one gender
  const possibleGender = DexSingleton.getGen().species.get(teamState.getPokemonInTeam(tabIdx)?.species ?? '')?.gender;
  // otherwise, its gender could be either M or F
  const availableGenders: string[] = possibleGender ? [possibleGender as string] : ['M', 'F'];
  const [gender, setGender] = useState(availableGenders[0]);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.getPokemonInTeam(tabIdx)) return;
    setGender(teamState.getPokemonInTeam(tabIdx)?.gender || availableGenders[0]);
  }, [teamState.getPokemonInTeam(tabIdx)?.gender]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    teamState.updatePokemonInTeam(tabIdx, 'gender', e.target.value);
  };

  return (
    <div className="flex space-x-0.5 text-sm lg:text-lg">
      <label className="hidden md:block">Gender: </label>
      {availableGenders.map((g) => (
        <Fragment key={g}>
          <label>{g}</label>
          <input type="radio" value={g} checked={gender === g} className="radio radio-sm md:radio-md" onChange={handleChange} />
        </Fragment>
      ))}
    </div>
  );
}

export default GenderPicker;
