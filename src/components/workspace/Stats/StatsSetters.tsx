import { Nature } from '@pkmn/dex-types';
import { StatsTable } from '@pkmn/types';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { getSingleEvUpperLimit, getStats } from '@/utils/Helpers';

const defaultStats: StatsTable = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

function StatsSetters() {
  const { teamState, tabIdx } = useContext(StoreContext);

  // get dex
  const { gen } = useContext(DexContext);
  const natures = Array.from(gen.natures);

  // stats
  const [base, setBase] = useState<StatsTable>(defaultStats);
  const [evs, setEvs] = useState<StatsTable>(defaultStats);
  const [ivs, setIvs] = useState<StatsTable>({
    hp: 31,
    atk: 31,
    def: 31,
    spa: 31,
    spd: 31,
    spe: 31,
  });
  const [nature, setNature] = useState<Nature>(natures[8]!); // default to Hardy

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

  // receive changes from other users
  useEffect(() => {
    const { nature: pNature } = teamState.team[tabIdx] ?? {};
    setNature((old) => natures.find((n) => n.name === pNature) ?? old);
  }, [teamState.team[tabIdx]?.nature]);

  // emit changes to other users
  const handleNatureSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newChecked = natures.find((n) => n.name === e.target.value)!;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].nature = newChecked.name;
  };

  const handleNatureRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [buff, stat] = e.target.name.split('-');
    const curBuff = buff === 'plus' ? 'plus' : 'minus';
    const opposingBuff = buff === 'plus' ? 'minus' : 'plus';
    const newChecked =
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === nature[opposingBuff]) ??
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === (stat === 'atk' ? 'def' : 'atk')) ??
      nature;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].nature = newChecked.name;
  };

  return (
    <>
      {/* Header */}
      <div role="rowheader" className="grid grid-cols-12 overflow-x-hidden px-4 text-xs font-bold md:gap-x-4 md:text-sm">
        <span></span>
        <span>Base</span>
        <span className="invisible md:visible">Nature</span>
        <span className="mx-2 md:mx-0">EVs</span>
        <span className="col-span-6"></span>
        <span>IVs</span>
        <span>Stats</span>
      </div>
      {/* Sliders */}
      {['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map((stat) => {
        const b = (base as unknown as { [s: string]: number })[stat] ?? 0;
        const iv = (ivs as unknown as { [s: string]: number })[stat] ?? 31;
        const ev = (evs as unknown as { [s: string]: number })[stat] ?? 0;
        const lv = teamState.team[tabIdx]?.level ?? 50;
        return (
          <div key={stat} className="grid-rows-7 grid grid-cols-12 items-center overflow-hidden px-4 text-xs md:gap-x-4 md:text-sm">
            {/* Column Header */}
            <span className="font-bold uppercase" role="columnheader">
              {stat}
            </span>
            {/* Base */}
            <span className="uppercase">{b}</span>
            {/* Nature radio */}
            <div className="flex space-x-0.5">
              <>
                <span>-</span>
                <input
                  type="radio"
                  name={`minus-${stat}`}
                  className="radio-primary radio radio-xs md:radio-sm"
                  checked={nature.minus === stat}
                  onChange={handleNatureRadioChange}
                  disabled={stat === 'hp'}
                />
                <input
                  type="radio"
                  name={`plus-${stat}`}
                  className="radio-secondary radio radio-xs md:radio-sm"
                  checked={nature.plus === stat}
                  onChange={handleNatureRadioChange}
                  disabled={stat === 'hp'}
                />
                <span>+</span>
              </>
            </div>
            {/* EVs - number input */}
            <input
              type="number"
              id={`ev-${stat}-number`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="input-bordered input input-xs col-span-2 mx-2 md:input-sm md:mx-0"
              onChange={(e) => {
                const newEv = Math.min(Number(e.target.value), getSingleEvUpperLimit(evs, ev));
                // @ts-ignore
                teamState.team[tabIdx].evs = {
                  ...evs,
                  [stat]: newEv,
                };
              }}
            />
            {/* EVs - range slider */}
            <input
              type="range"
              id={`ev-${stat}-range`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="range range-xs col-span-5 md:range-sm "
              onChange={(e) => {
                const newEv = Math.min(Number(e.target.value), getSingleEvUpperLimit(evs, ev));
                // @ts-ignore
                teamState.team[tabIdx].evs = {
                  ...evs,
                  [stat]: newEv,
                };
              }}
            />
            {/* IVs - number input */}
            <input
              type="number"
              id={`iv-${stat}-number`}
              min="0"
              max="31"
              value={iv}
              className="input-bordered input input-xs appearance-none md:input-sm"
              onChange={(e) => {
                // @ts-ignore
                teamState.team[tabIdx].ivs = {
                  ...ivs,
                  [stat]: Number(e.target.value),
                };
              }}
            />
            {/* Final Stat */}
            <span>{getStats(stat, b, ev, iv, nature, lv)}</span>
          </div>
        );
      })}
      {/* Nature */}
      <div className="grid grid-cols-12 items-center overflow-hidden px-4 py-1 text-xs md:text-sm">
        <span className="font-bold uppercase" role="columnheader">
          Nature
        </span>
        <select id="nature" className="select-bordered select select-xs col-span-2 md:select-sm" value={nature.name} onChange={handleNatureSelectChange}>
          {natures.map((n) => (
            <option key={n.name} value={n.name}>
              {n.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default StatsSetters;
