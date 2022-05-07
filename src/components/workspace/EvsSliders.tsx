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
      <div role="rowheader" className="grid grid-cols-12 overflow-x-hidden px-4 text-xs font-bold md:gap-x-4 md:text-sm">
        <span></span>
        <span>Base</span>
        <span className="invisible md:visible">Nature</span>
        <span className="mx-2 md:mx-0">EVs</span>
        <span className="col-span-6"></span>
        <span>IVs</span>
        <span>Stats</span>
      </div>
      {['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map((stat) => {
        const b = (base as unknown as { [s: string]: number })[stat] ?? 0;
        const iv = (ivs as unknown as { [s: string]: number })[stat] ?? 31;
        const ev = (evs as unknown as { [s: string]: number })[stat] ?? 0;
        const lv = teamState.team[tabIdx]?.level ?? 50;
        return (
          <div key={stat} className="grid-rows-7 grid grid-cols-12 items-center overflow-hidden px-4 text-xs md:gap-x-4 md:text-sm">
            <span className="font-bold uppercase" role="columnheader">
              {stat}
            </span>
            <span className="uppercase">{b}</span>
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
              className="input-bordered input input-xs col-span-2 mx-2 md:input-sm md:col-span-1 md:mx-0"
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
              className="range range-xs col-span-5 md:range-sm md:col-span-6"
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
            <span>
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
