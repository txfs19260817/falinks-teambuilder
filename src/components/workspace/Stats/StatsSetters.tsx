import type { Nature } from '@pkmn/dex-types';
import type { StatsTable } from '@pkmn/types';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import DexSingleton from '@/models/DexSingleton';
import { defaultIvs, defaultStats, defaultSuggestedSpreads, getSingleEvUpperLimit, getStats, getSuggestedSpreadsBySpecie } from '@/utils/PokemonUtils';
import type { Spreads } from '@/utils/Types';

function StatsSetters() {
  const { teamState, tabIdx } = useContext(StoreContext);

  // fetch popular spreads by Pokémon
  const { species } = teamState.getPokemonInTeam(tabIdx) ?? {};
  const { data: suggestedSpreads } = useSWR<Spreads[]>( // suggestedSpreads StatsTable
    species ? `/api/usages/stats/${species}?format=${teamState.format}&spreads=true` : null, // ?spreads=true doesn't work in the API, only used as a cache buster for SWR.
    {
      fallbackData: [], // defaultSuggestedSpreads is concatenated to returned suggestions when rendering
      fetcher: (u: string) =>
        fetch(u)
          .then((r) => r.json())
          .then(getSuggestedSpreadsBySpecie),
    }
  );

  const natures = Array.from(DexSingleton.getGen().natures);

  // stats
  const [base, setBase] = useState<StatsTable>(defaultStats);
  const [evs, setEvs] = useState<StatsTable>(defaultStats);
  const [ivs, setIvs] = useState<StatsTable>(defaultIvs);
  const [nature, setNature] = useState<Nature>(natures[8]!); // default to Hardy

  useEffect(() => {
    const pName = teamState.getPokemonInTeam(tabIdx)?.species ?? '';
    setBase((old) => DexSingleton.getGen().species.get(pName)?.baseStats ?? old);
  }, [teamState.getPokemonInTeam(tabIdx)?.species]);

  useEffect(() => {
    const { evs: pEvs } = teamState.getPokemonInTeam(tabIdx) ?? {};
    setEvs((old) => pEvs ?? old);
  }, [teamState.getPokemonInTeam(tabIdx)?.evs]);

  useEffect(() => {
    const { ivs: pIvs } = teamState.getPokemonInTeam(tabIdx) ?? {};
    setIvs((old) => pIvs ?? old);
  }, [teamState.getPokemonInTeam(tabIdx)?.ivs]);

  // receive changes from other users
  useEffect(() => {
    const pNature = teamState.getPokemonInTeam(tabIdx)?.nature;
    setNature((old) => natures.find((n) => n.name === pNature) ?? old);
  }, [teamState.getPokemonInTeam(tabIdx)?.nature]);

  // emit changes to other users
  const handleNatureSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newChecked = natures.find((n) => n.name === e.target.value)!;
    teamState.updatePokemonInTeam(tabIdx, 'nature', newChecked.name);
  };

  const handleNatureRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [buff, stat] = e.target.name.split('-');
    const curBuff = buff === 'plus' ? 'plus' : 'minus';
    const opposingBuff = buff === 'plus' ? 'minus' : 'plus';
    const newChecked =
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === nature[opposingBuff]) ??
      natures.find((n) => n[curBuff] === stat && n[opposingBuff] === (stat === 'atk' ? 'def' : 'atk')) ??
      nature;
    teamState.updatePokemonInTeam(tabIdx, 'nature', newChecked.name);
  };

  const handleSuggestionSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selectedSpreads = suggestedSpreads?.find((s) => s.label === label) ?? defaultSuggestedSpreads.find((s) => s.label === label);
    if (!selectedSpreads) return;
    const { nature: newNature, evs: newEvs } = selectedSpreads;
    teamState.updatePokemonInTeam(tabIdx, 'nature', newNature);
    teamState.updatePokemonInTeam(tabIdx, 'evs', newEvs);
  };

  const handleEVInputChange = (e: ChangeEvent<HTMLInputElement>, ev: number, stat: string) => {
    let newEv = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    newEv = Number.isNaN(newEv) ? (evs as unknown as { [s: string]: number })[stat] ?? 0 : Math.min(newEv, getSingleEvUpperLimit(evs, ev));
    setEvs((old) => ({ ...old, [stat]: newEv }));
  };

  // mouse up or on blur
  const handleEVInputDone = (
    e: MouseEvent<HTMLInputElement> | FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | TouchEvent<HTMLInputElement>,
    stat: string
  ) => {
    // @ts-ignore
    if (e.key && !['ArrowDown', 'ArrowUp', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Enter'].includes(e.key)) return;
    teamState.updatePokemonInTeam(tabIdx, 'evs', {
      ...evs,
      [stat]: Number((e.target as HTMLInputElement).value),
    });
  };

  const handleIVInputChange = (e: ChangeEvent<HTMLInputElement>, stat: string) => {
    const newIv = Math.min(Number(e.target.value), 31);
    setIvs((old) => ({ ...old, [stat]: newIv }));
    teamState.updatePokemonInTeam(tabIdx, 'ivs', {
      ...ivs,
      [stat]: newIv,
    });
  };

  return (
    <>
      {/* Header */}
      <div role="rowheader" className="grid grid-cols-12 px-4 text-xs font-bold overflow-x-hidden md:gap-x-4 md:text-sm">
        <span></span>
        <span>Base</span>
        <span className="invisible md:visible">Nature</span>
        <span className="mx-2 md:mx-0">EVs</span>
        <span className="col-span-6"></span>
        <span>IVs</span>
        <span>Stats</span>
      </div>
      {/* Sliders */}
      {['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map((stat: string) => {
        const b = (base as unknown as { [s: string]: number })[stat] ?? 0;
        const iv = (ivs as unknown as { [s: string]: number })[stat] ?? 31;
        const ev = (evs as unknown as { [s: string]: number })[stat] ?? 0;
        const lv = teamState.getPokemonInTeam(tabIdx)?.level ?? 50;
        return (
          <div key={stat} className="grid-rows-7 grid grid-cols-12 items-center overflow-hidden px-4 text-xs md:gap-x-4 md:text-sm">
            {/* Column Header */}
            <span className="font-bold uppercase" role="columnheader">
              {stat}
            </span>
            {/* Base */}
            <span className="uppercase">{b}</span>
            {/* Nature radio: plus - primary; minus - secondary */}
            <div className="flex space-x-0.5">
              <>
                <span>+</span>
                <input
                  type="radio"
                  name={`plus-${stat}`}
                  className="radio-primary radio radio-xs md:radio-sm"
                  checked={nature.plus === stat}
                  onChange={handleNatureRadioChange}
                  disabled={stat === 'hp'}
                />
                <input
                  type="radio"
                  name={`minus-${stat}`}
                  className="radio-secondary radio radio-xs md:radio-sm"
                  checked={nature.minus === stat}
                  onChange={handleNatureRadioChange}
                  disabled={stat === 'hp'}
                />
                <span>-</span>
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
              className={`input-bordered ${
                nature.plus === stat ? 'input-primary' : nature.minus === stat ? 'input-secondary' : ''
              } input input-xs col-span-2 mx-2 md:input-sm md:mx-0`}
              onChange={(e) => handleEVInputChange(e, ev, stat)}
              onKeyUp={(e) => handleEVInputDone(e, stat)}
              onMouseUp={(e) => handleEVInputDone(e, stat)}
              onTouchEnd={(e) => handleEVInputDone(e, stat)}
              onBlur={(e) => handleEVInputDone(e, stat)}
            />
            {/* EVs - range slider */}
            <input
              type="range"
              id={`ev-${stat}-range`}
              min="0"
              max="252"
              step="4"
              value={ev}
              className="range range-xs col-span-5 md:range-sm"
              onChange={(e) => handleEVInputChange(e, ev, stat)}
              onMouseUp={(e) => handleEVInputDone(e, stat)}
              onTouchEnd={(e) => handleEVInputDone(e, stat)}
            />
            {/* IVs - number input */}
            <input
              type="number"
              id={`iv-${stat}-number`}
              min="0"
              max="31"
              value={iv}
              className="input-bordered input input-xs appearance-none md:input-sm"
              onChange={(e) => handleIVInputChange(e, stat)}
            />
            {/* Final Stat */}
            <span>{getStats(stat, b, ev, iv, nature, lv)}</span>
          </div>
        );
      })}
      {/* Nature */}
      <div className="grid grid-cols-12 items-center overflow-hidden px-4 py-1 text-xs md:text-sm">
        <span className="font-bold uppercase" role="columnheader">
          Nature:
        </span>
        <select id="nature" className="select-bordered select select-xs col-span-2 md:select-sm" value={nature.name} onChange={handleNatureSelectChange}>
          {natures.map((n) => (
            <option key={n.name} value={n.name}>
              {n.name}
              {n.plus && ` (+${n.plus} / -${n.minus})`}
            </option>
          ))}
        </select>
        {/* Suggestion Selector */}
        <span className="col-span-2 text-center font-bold uppercase" role="columnheader">
          Suggestions:
        </span>
        <select className="select-bordered select select-xs col-span-6 md:select-sm" defaultValue="" onChange={handleSuggestionSelectChange}>
          <option value="" disabled>
            Suggested EVs spreads
          </option>
          {(suggestedSpreads || []).concat(defaultSuggestedSpreads).map(({ label }) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default StatsSetters;
