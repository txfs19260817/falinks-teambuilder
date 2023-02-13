import { StatID, StatsTable } from '@pkmn/types';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import DexSingleton from '@/models/DexSingleton';
import { defaultStats, getStats } from '@/utils/PokemonUtils';

function StatsClickable() {
  const { t } = useTranslation(['common']);
  const thisFocusedFieldState: FocusedFieldToIdx = { Stats: 0 };
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  const natures = Array.from(DexSingleton.getGen().natures);
  const [stats, setStats] = useState<StatsTable>(defaultStats);

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    const { species: pName, ivs, evs, nature: natureName, level } = pm;
    const bases = DexSingleton.getGenByFormat(teamState.format).species.get(pName ?? '')?.baseStats ?? defaultStats;
    const nature = natures.find((n) => n.name === natureName) ?? natures[0]!;
    // compute new stats
    const newStats: StatsTable = { ...defaultStats };
    Object.keys(newStats).forEach((stat) => {
      newStats[stat as StatID] = getStats(stat, bases[stat as StatID], evs[stat as StatID], ivs[stat as StatID], nature, level);
    });
    setStats(newStats);
  }, [
    teamState.getPokemonInTeam(tabIdx),
    teamState.getPokemonInTeam(tabIdx)?.species,
    teamState.getPokemonInTeam(tabIdx)?.ivs,
    teamState.getPokemonInTeam(tabIdx)?.evs,
    teamState.getPokemonInTeam(tabIdx)?.nature,
    teamState.getPokemonInTeam(tabIdx)?.level,
  ]);

  return (
    <label
      className={`input-group-md input-group input-group-vertical rounded-lg border border-base-300 transition-all md:input-group-lg hover:opacity-80 hover:shadow-xl `}
      onClick={() =>
        focusedFieldDispatch({
          type: 'set',
          payload: {
            Stats: 0,
          },
        })
      }
    >
      <span>{t('common.stats.stats')}</span>
      <div
        role="rowgroup"
        className={`border border-primary bg-base-100 hover:bg-base-200 ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
      >
        {Object.entries(stats).map(([key, value]) => (
          <div role="progressbar" key={key} className="flex flex-wrap items-center justify-between px-1 md:py-1">
            <label className="w-16 flex-none text-sm uppercase">{t(`common.stats.${key}`)}: </label>
            <meter className="w-full flex-1" min={0} max={300} low={100} high={150} optimum={200} value={value} title={`${value}`} />
            <label className="w-12 flex-none">{value}</label>
          </div>
        ))}
      </div>
    </label>
  );
}

export default StatsClickable;
