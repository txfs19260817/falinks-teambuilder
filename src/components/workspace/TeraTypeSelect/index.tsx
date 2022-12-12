import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import DexSingleton from '@/models/DexSingleton';
import { typesWithEmoji } from '@/utils/PokemonUtils';

function TeraTypeSelect() {
  const { t } = useTranslation(['common', 'types']);
  const { teamState, tabIdx } = useContext(StoreContext);
  const defaultTeraTypeValue = DexSingleton.getGen().species.get(teamState.getPokemonInTeam(tabIdx)?.species ?? '')?.types[0] ?? 'Normal';
  const [teraType, setTeraType] = useState<string>(defaultTeraTypeValue);

  const teraTypeOptions = [
    { label: `(${t('common.auto')})`, value: defaultTeraTypeValue }, // auto
    ...typesWithEmoji
      .filter(({ value }) => value !== '???') // remove ??? type
      .map(({ value }) => ({
        label: t(value.toLowerCase(), { ns: 'types' }),
        value,
      })),
  ];

  // receive changes from other users
  useEffect(() => {
    if (!teamState.getPokemonInTeam(tabIdx)) return;
    setTeraType(teamState.getPokemonInTeam(tabIdx)?.teraType || defaultTeraTypeValue);
  }, [teamState.getPokemonInTeam(tabIdx)?.teraType]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTeraType = e.target.value;
    setTeraType(newTeraType);
    teamState.updatePokemonInTeam(tabIdx, 'teraType', newTeraType);
  };

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>{t('common.teraType')}</label>
      <select className="select-bordered select-primary select select-xs" onChange={handleChange} value={teraType}>
        {teraTypeOptions.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TeraTypeSelect;
