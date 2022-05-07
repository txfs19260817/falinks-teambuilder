import { StatsTable } from '@pkmn/types';
import { useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { PanelProps } from '@/components/workspace/types';

export function EvsSliders({ tabIdx, teamState }: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);
  const [base, setBase] = useState<StatsTable>({
    hp: 0,
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
  });
  const [evs, setEvs] = useState<StatsTable>({
    hp: 0,
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
  });
  const [ivs, setIvs] = useState<StatsTable>({
    hp: 31,
    atk: 31,
    def: 31,
    spa: 31,
    spd: 31,
    spe: 31,
  });

  useEffect(() => {
    const { species: pName } = teamState.team[tabIdx] ?? {};
    setBase((old) => gen.species.get(pName ?? '')?.baseStats ?? old);
  }, [teamState.team[tabIdx]?.species]);

  useEffect(() => {
    const { evs: pEvs } = teamState.team[tabIdx] ?? {};
    setEvs((old) => pEvs ?? old);
  }, [teamState.team[tabIdx]?.evs]);

  useEffect(() => {
    const { ivs: pIvs } = teamState.team[tabIdx] ?? {};
    setIvs((old) => pIvs ?? old);
  }, [teamState.team[tabIdx]?.ivs]);

  return (
    <>
      {['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map((stat) => {
        const b = (base as unknown as { [s: string]: number })[stat] ?? 0;
        const iv = (ivs as unknown as { [s: string]: number })[stat] ?? 31;
        const ev = (evs as unknown as { [s: string]: number })[stat] ?? 0;
        const lv = teamState.team[tabIdx]?.level ?? 50;
        return (
          <div key={stat} className="flex items-center space-x-2 px-4 text-xs md:text-sm">
            <label className="w-1/6 uppercase md:w-1/12">{stat}</label>
            <span className="w-1/6 uppercase md:w-1/12">{b}</span>
            <div className="flex space-x-0.5">
              <input type="radio" name="desc" className="radio-primary radio radio-xs md:radio-sm" />
              <input type="radio" name="inc" className="radio-secondary radio radio-xs md:radio-sm" />
            </div>
            <input
              type="number"
              id={`ev-${stat}-number`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="input-bordered input input-xs md:input-sm"
              onChange={(e) => {
                setEvs({ ...evs, [stat]: Number(e.target.value) });
                // @ts-ignore
                teamState.team[tabIdx].evs = {
                  ...evs,
                  [stat]: Number(e.target.value),
                };
              }}
            />
            <input
              type="range"
              id={`ev-${stat}-range`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="range range-xs md:range-sm"
              onChange={(e) => {
                setEvs({ ...evs, [stat]: Number(e.target.value) });
                // @ts-ignore
                teamState.team[tabIdx].evs = {
                  ...evs,
                  [stat]: Number(e.target.value),
                };
              }}
            />
            <input
              type="number"
              id={`iv-${stat}-number`}
              min="0"
              max="31"
              value={iv}
              className="input-bordered input input-xs md:input-sm"
              onChange={(e) => {
                setIvs({ ...ivs, [stat]: Number(e.target.value) });
                // @ts-ignore
                teamState.team[tabIdx].ivs = {
                  ...ivs,
                  [stat]: Number(e.target.value),
                };
              }}
            />
            <span className="w-1/6 md:w-1/12">
              {stat === 'hp'
                ? Math.floor((Math.floor(2 * b + iv + Math.floor(ev / 4) + 100) * lv) / 100 + 10)
                : Math.floor((Math.floor(2 * b + iv + Math.floor(ev / 4)) * lv) / 100 + 5)}
            </span>
          </div>
        );
      })}
    </>
  );
}
