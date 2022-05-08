import { Nature } from '@pkmn/dex-types';
import { StatsTable } from '@pkmn/types';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { PanelProps } from '@/components/workspace/types';

export function EvsSliders({ tabIdx, teamState }: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);
  const natures = Array.from(gen.natures);

  //  stats
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
  const handleNatureChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newChecked = natures.find((n) => n.name === e.target.value)!;
    setNature(newChecked);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].nature = newChecked.name;
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [buff, stat] = e.target.name.split('-');
    const curBuff = buff === 'plus' ? 'plus' : 'minus';
    const opposingBuff = buff === 'plus' ? 'minus' : 'plus';
    const newChecked =
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === nature[opposingBuff]) ??
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === (stat === 'atk' ? 'def' : 'atk')) ??
      nature;
    setNature(newChecked);
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
            <span className="font-bold uppercase" role="columnheader">
              {stat}
            </span>
            <span className="uppercase">{b}</span>
            <div className="flex space-x-0.5">
              <>
                <span>-</span>
                <input
                  type="radio"
                  name={`minus-${stat}`}
                  className="radio-primary radio radio-xs md:radio-sm"
                  checked={nature.minus === stat}
                  onChange={handleRadioChange}
                  disabled={stat === 'hp'}
                />
                <input
                  type="radio"
                  name={`plus-${stat}`}
                  className="radio-secondary radio radio-xs md:radio-sm"
                  checked={nature.plus === stat}
                  onChange={handleRadioChange}
                  disabled={stat === 'hp'}
                />
                <span>+</span>
              </>
            </div>
            <input
              type="number"
              id={`ev-${stat}-number`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="input-bordered input input-xs col-span-2 mx-2 md:input-sm md:mx-0"
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
              className="range range-xs col-span-5 md:range-sm "
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
                : Math.floor(((Math.floor(2 * b + iv + Math.floor(ev / 4)) * lv) / 100 + 5) * (nature.plus === stat ? 1.1 : nature.minus === stat ? 0.9 : 1))}
            </span>
          </div>
        );
      })}
      {/* Nature */}
      <div className="grid grid-cols-12 items-center overflow-hidden px-4 py-1 text-xs md:text-sm">
        <span className="font-bold uppercase" role="columnheader">
          Nature
        </span>
        <select id="nature" className="select-bordered select select-xs col-span-2 md:select-sm" value={nature.name} onChange={handleNatureChange}>
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
