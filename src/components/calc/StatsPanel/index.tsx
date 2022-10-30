import { StatsTable } from '@pkmn/types';
import { memo } from 'react';

import { PlainSelect } from '@/components/calc/PlainSelect';
import { boostLevels, BoostTable } from '@/utils/PokemonUtils';

const StatsPanel = memo(
  ({
    baseStats,
    boosts: boostTable,
    evs: evsTable,
    ivs: ivsTable,
    setBoosts,
    setEvs,
    setIvs,
    stats,
  }: {
    baseStats: StatsTable;
    ivs: StatsTable;
    setIvs: (ivs: StatsTable) => void;
    evs: StatsTable;
    setEvs: (evs: StatsTable) => void;
    stats: StatsTable;
    boosts: BoostTable;
    setBoosts: (boosts: BoostTable) => void;
  }) => (
    <div className="grid grid-cols-6 gap-1">
      <div role="columnheader" className="grid grid-cols-1 text-sm">
        {['\u00a0\u00a0', 'HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed', 'Total'].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
      <div role="gridcell" className="grid grid-cols-1">
        <span>Base</span>
        {Object.values(baseStats).map((s, i) => (
          <span className="text-sm" key={i}>
            {s}
          </span>
        ))}
        <span>{Object.values(baseStats).reduce((a, b) => a + b, 0)}</span>
      </div>
      <div role="gridcell" className="grid grid-cols-1">
        <span>IVs</span>
        {Object.values(ivsTable).map((s, i) => (
          <input
            key={i}
            className="input-bordered input input-xs"
            type="number"
            min="0"
            max="31"
            value={s}
            onChange={(e) =>
              setIvs({
                ...ivsTable,
                [Object.keys(ivsTable)[i] as string]: +e.target.value,
              })
            }
          />
        ))}
        <span>&nbsp;</span>
      </div>
      <div role="gridcell" className="grid grid-cols-1">
        <span>EVs</span>
        {Object.values(evsTable).map((s, i) => (
          <input
            key={i}
            className="input-bordered input input-xs"
            type="number"
            step="4"
            min="0"
            max="252"
            value={s}
            onChange={(e) =>
              setEvs({
                ...evsTable,
                [Object.keys(evsTable)[i] as string]: +e.target.value,
              })
            }
          />
        ))}
        <span>{Object.values(evsTable).reduce((a, b) => a + b, 0)}</span>
      </div>
      <div role="gridcell" className="grid grid-cols-1">
        <span>Stats</span>
        {Object.values(stats).map((s, i) => (
          <span className="text-sm" key={i}>
            {s}
          </span>
        ))}
        <span>&nbsp;</span>
      </div>
      <div role="gridcell" className="grid grid-cols-1">
        <span>Boosts</span>
        <span>&nbsp;</span>
        {Object.entries(boostTable).map(([k, v]) => (
          <PlainSelect key={k} value={v.toString()} options={boostLevels.map((b) => b.toString())} onChange={(b) => setBoosts({ ...boostTable, [k]: b })} />
        ))}
        <span>&nbsp;</span>
      </div>
    </div>
  )
);
StatsPanel.displayName = 'StatsPanel';

export { StatsPanel };
