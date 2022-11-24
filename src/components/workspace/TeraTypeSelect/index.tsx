import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import DexSingleton from '@/models/DexSingleton';
import { typesWithEmoji } from '@/utils/PokemonUtils';

const autoTeraTypeLiteral = '(Auto)';

function TeraTypeSelect() {
  const { teamState, tabIdx } = useContext(StoreContext);
  const defaultTeraType = DexSingleton.getGen().species.get(teamState.getPokemonInTeam(tabIdx)?.species ?? '')?.types[0] ?? 'Normal';
  const [teratype, setTeratype] = useState<string>(defaultTeraType);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.getPokemonInTeam(tabIdx)) return;
    setTeratype(teamState.getPokemonInTeam(tabIdx)?.teraType || defaultTeraType);
  }, [teamState.getPokemonInTeam(tabIdx)?.teraType]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTeraType = e.target.value;
    if (newTeraType === autoTeraTypeLiteral) {
      setTeratype(defaultTeraType);
      teamState.updatePokemonInTeam(tabIdx, 'teraType', defaultTeraType);
    } else {
      setTeratype(newTeraType);
      teamState.updatePokemonInTeam(tabIdx, 'teraType', newTeraType);
    }
  };

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>Tera Type</label>
      <select className="select select-xs select-bordered select-primary" onChange={handleChange} value={teratype}>
        {typesWithEmoji
          // replace ??? with Auto
          .map(({ value }) => (value === '???' ? autoTeraTypeLiteral : value))
          .sort()
          .map((option) => (
            <option key={option}>{option}</option>
          ))}
      </select>
    </div>
  );
}

export default TeraTypeSelect;
