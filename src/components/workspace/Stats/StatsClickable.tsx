import { StatID, StatsTable } from '@pkmn/types';
import { useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import { getStats } from '@/utils/Helpers';

const defaultStats: StatsTable = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

function StatsClickable() {
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);
  // get dex
  const { gen } = useContext(DexContext);
  const natures = Array.from(gen.natures);
  const [stats, setStats] = useState<StatsTable>(defaultStats);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    const { species: pName, ivs, evs, nature: natureName, level } = teamState.team[tabIdx] ?? {};
    const bases = gen.species.get(pName ?? '')?.baseStats ?? defaultStats;
    const nature = natures.find((n) => n.name === natureName) ?? natures[0]!;
    // compute new stats
    const newStats: StatsTable = { ...defaultStats };
    Object.keys(newStats).forEach((stat) => {
      newStats[stat as StatID] = getStats(stat, bases[stat as StatID], evs![stat as StatID], ivs![stat as StatID], nature, level);
    });
    setStats(newStats);
  }, [
    teamState.team[tabIdx],
    teamState.team[tabIdx]?.species,
    teamState.team[tabIdx]?.ivs,
    teamState.team[tabIdx]?.evs,
    teamState.team[tabIdx]?.nature,
    teamState.team[tabIdx]?.level,
  ]);

  return (
    <label
      className="input-group-md input-group input-group-vertical rounded-lg border border-base-300 transition-all hover:opacity-80 hover:shadow-xl md:input-group-lg"
      onClick={() =>
        setFocusedField({
          Stats: 0,
        })
      }
    >
      <span>Status</span>
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="flex flex-wrap items-center justify-between bg-base-100 px-1 hover:bg-base-200 md:py-1">
          <label className="w-10 flex-none uppercase">{key}: </label>
          <meter className="invisible w-full flex-1 sm:visible" min={0} max={300} low={100} high={150} optimum={200} value={value} title={`${value}`} />
          <label className="text-xs md:w-10 md:text-lg">{value}</label>
        </div>
      ))}
    </label>
  );
}

export default StatsClickable;