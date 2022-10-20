import { Ability, AbilityName, Item, Move, Nature, Specie, TypeName } from '@pkmn/data';
import { SpeciesAbility } from '@pkmn/dex-types';
import { StatID, StatsTable, StatusName } from '@pkmn/types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Select } from '@/components/select/Select';
import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import { DexContext } from '@/components/workspace/Contexts/DexContext';
import {
  boostLevels,
  BoostTable,
  defaultBoosts,
  defaultIvs,
  defaultStats,
  getMovesBySpecie,
  getPokemonIcon,
  moveCategoriesWithEmoji,
  StatusMap,
  statusMapValueToName,
  typesWithEmoji,
} from '@/utils/PokemonUtils';

type PokemonInfoProps = {
  index: 1 | 2;
};

const PlainSelect = ({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label?: string }) => (
  <label className="input-group-xs input-group w-1/2">
    {label && <span className="input-addon w-28 border border-neutral">{label}</span>}
    <select className="select-bordered select select-xs" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((f, i) => (
        <option key={i} value={f}>
          {f}
        </option>
      ))}
    </select>
  </label>
);

export const PokemonInfo = ({ index }: PokemonInfoProps) => {
  const { basePath } = useRouter();
  // data
  const { gen } = useContext(DexContext);
  const pokemonList = useMemo<Specie[]>(() => Array.from(gen.species), [gen]);
  const itemList = useMemo<Item[]>(() => Array.from(gen.items), [gen]);
  const natureList = useMemo<Nature[]>(() => Array.from(gen.natures), [gen]);
  // States
  const [pokemon, setPokemon] = useState<Specie>(pokemonList[0]!);
  const [types, setTypes] = useState<[TypeName] | [TypeName, TypeName]>(pokemon.types);
  const [level, setLevel] = useState(50);
  const [item, setItem] = useState<Item>(gen.items.get('Adamant Orb')!);
  const [ability, setAbility] = useState<Ability>(gen.abilities.get(pokemon.abilities[0])!);
  const [abilityTable, setAbilityTable] = useState<SpeciesAbility<'' | AbilityName>>(pokemon.abilities); // data
  const [nature, setNature] = useState<Nature>(gen.natures.get('Hardy')!);
  const [evs, setEvs] = useState<StatsTable>(defaultStats);
  const [ivs, setIvs] = useState<StatsTable>(defaultIvs);
  const [baseStats, setBaseStats] = useState<StatsTable>(pokemon.baseStats);
  const [boosts, setBoosts] = useState<BoostTable>(defaultBoosts);
  const [status, setStatus] = useState<StatusName | ''>('');
  // moves are selected 4 moves; learnset is all moves that Pokémon can learn
  const [moves, setMoves] = useState<[Move, Move, Move, Move]>([
    gen.moves.get('Thunderbolt')!,
    gen.moves.get('Flamethrower')!,
    gen.moves.get('Ice Beam')!,
    gen.moves.get('Earthquake')!,
  ]);
  const stats = useMemo<StatsTable>(
    () =>
      Object.fromEntries(
        (Object.entries(baseStats) as Array<[StatID, number]>).map(([k, base]) => [k, gen.stats.calc(k, base, ivs[k], evs[k], level, nature)])
      ) as StatsTable,
    [baseStats, evs, gen, ivs, level, nature]
  );
  const [crits, setCrits] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);
  const [learnset, setLearnset] = useState<Move[]>([]);
  const [currentHP, setCurrentHP] = useState(stats.hp);
  const [dynamax, setDynamax] = useState(false);

  // Effects: update some properties when Pokémon changes
  useEffect(() => {
    setTypes(pokemon.types);
    setAbility(gen.abilities.get(pokemon.abilities[0])!);
    setAbilityTable(pokemon.abilities);
    setBaseStats(pokemon.baseStats);
    if (pokemon.requiredItem) {
      setItem(gen.items.get(pokemon.requiredItem)!);
    }
    getMovesBySpecie(gen, pokemon.name).then(setLearnset);
  }, [pokemon]);

  return (
    <section className="mockup-window border bg-base-300">
      <h1 className="w-full border-b border-base-300 indent-3 text-xl font-bold">Pokemon {index}</h1>
      <div className="form-control gap-1 px-2">
        {/* Pokemon */}
        <Select
          className="w-5/6"
          options={pokemonList.map((p) => ({ value: p.name, label: p.name }))}
          onChange={(e) => {
            const pm = gen.species.get(e.value) ?? pokemon;
            setPokemon(pm);
          }}
          value={{ value: pokemon.name, label: pokemon.name }}
          iconGetter={(key: string) => <span title={key} style={getPokemonIcon(undefined, key, true)}></span>}
        />
        {/* Types */}
        <div className="form-control xl:flex-row">
          <label className="input-group-xs input-group">
            <span className="input-addon w-28 border border-neutral">Type1</span>
            <ValueWithEmojiSelector
              options={typesWithEmoji}
              bindValue={types[0]}
              className="select-bordered select-xs w-1/3 xl:w-1/2"
              onChange={(e) => {
                const type1 = e.target.value as TypeName;
                const oldType2 = types[1];
                const newTypes: [TypeName] | [TypeName, TypeName] = oldType2 && oldType2.length > 0 ? [type1, oldType2] : [type1];
                setTypes(newTypes);
              }}
            />
          </label>
          <label className="input-group-xs input-group">
            <span className="input-addon w-28 border border-neutral">Type2</span>
            <ValueWithEmojiSelector
              options={typesWithEmoji}
              bindValue={types[1] ?? ''}
              className="select-bordered select-xs w-1/3 xl:w-1/2"
              emptyOption="(None)"
              onChange={(e) => {
                const type2 = e.target.value as TypeName | '';
                const oldType1 = types[0];
                const newTypes: [TypeName] | [TypeName, TypeName] = type2 && type2.length > 0 ? [oldType1, type2] : [oldType1];
                setTypes(newTypes);
              }}
            />
          </label>
        </div>
        {/* Forme if applicable */}
        {pokemon.formes && pokemon.formes.length > 0 && (
          <div className="flex">
            <PlainSelect label="Forme" value={pokemon.formes[0]!} onChange={(f) => setPokemon(gen.species.get(f) ?? pokemon)} options={pokemon.formes} />
          </div>
        )}
        {/* Level */}
        <div className="flex">
          <label className="input-group-xs input-group">
            <span className="input-addon w-28 border border-neutral">Level</span>
            <input className="input-bordered input input-xs" type="number" min="1" max="100" value={level} onChange={(e) => setLevel(+e.target.value)} />
          </label>
        </div>
        {/*  Stats */}
        <div className="grid grid-cols-6 gap-1">
          <div role="columnheader" className="grid grid-cols-1 text-sm">
            {['\u00a0\u00a0', 'HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed', 'Total'].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <div role="gridcell" className="grid grid-cols-1">
            <span>Base</span>
            {Object.values(baseStats).map((s, i) => (
              <input key={i} className="input-bordered input input-xs" type="number" min="0" max="255" value={s} />
            ))}
            <span>{Object.values(baseStats).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div role="gridcell" className="grid grid-cols-1">
            <span>IVs</span>
            {Object.values(ivs).map((s, i) => (
              <input
                key={i}
                className="input-bordered input input-xs"
                type="number"
                min="0"
                max="31"
                value={s}
                onChange={(e) =>
                  setIvs({
                    ...ivs,
                    [Object.keys(ivs)[i] as string]: +e.target.value,
                  })
                }
              />
            ))}
            <span>&nbsp;</span>
          </div>
          <div role="gridcell" className="grid grid-cols-1">
            <span>EVs</span>
            {Object.values(evs).map((s, i) => (
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
                    ...evs,
                    [Object.keys(evs)[i] as string]: +e.target.value,
                  })
                }
              />
            ))}
            <span>{Object.values(evs).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div role="gridcell" className="grid grid-cols-1">
            <span>Stats</span>
            {Object.values(stats).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
            <span>&nbsp;</span>
          </div>
          <div role="gridcell" className="grid grid-cols-1">
            <span>Boosts</span>
            <span>&nbsp;</span>
            {Object.entries(boosts).map(([k, v]) => (
              <PlainSelect key={k} value={v.toString()} options={boostLevels.map((b) => b.toString())} onChange={(b) => setBoosts({ ...boosts, [k]: b })} />
            ))}
            <span>&nbsp;</span>
          </div>
        </div>
        {/* Nature */}
        <label className="input-group-xs input-group flex">
          <PlainSelect label="Nature" value={nature.name} onChange={(n) => setNature(gen.natures.get(n)!)} options={natureList.map((n) => n.name)} />
        </label>
        {/*  Ability */}
        <label className="input-group-xs input-group flex">
          <PlainSelect label="Ability" value={ability.name} onChange={(a) => setAbility(gen.abilities.get(a)!)} options={Object.values(abilityTable)} />
        </label>
        {/* Item */}
        <label className="input-group-xs input-group flex">
          <PlainSelect label="Item" value={item.name} onChange={(n) => setItem(gen.items.get(n)!)} options={itemList.map((n) => n.name)} />
        </label>
        {/* Status */}
        <label className="input-group-xs input-group flex">
          <PlainSelect
            label="Status"
            value={statusMapValueToName(status)}
            onChange={(k) => setStatus(StatusMap.get(k)!)}
            options={Array.from(StatusMap.keys())}
          />
        </label>
        {/*  Current HP */}
        <label className="input-group-xs input-group flex">
          <span title="Current HP" className="input-addon border border-neutral">
            HP
          </span>
          <input
            className="input-bordered input input-xs"
            type="number"
            min="0"
            max="255"
            defaultValue={stats.hp}
            value={currentHP}
            onChange={(e) => setCurrentHP(parseInt(e.target.value, 10))}
          />
          <span>/{stats.hp}</span>
          <input
            className="input-bordered input input-xs"
            type="text"
            value={(currentHP / stats.hp) * 100}
            onChange={(e) => setCurrentHP(~~((+e.target.value / 100) * stats.hp))}
          />
          <span>%</span>
          <button className={`btn btn-xs ${dynamax ? '' : 'btn-outline'}`} onClick={() => setDynamax(!dynamax)}>
            Dynamax
          </button>
        </label>
        {/*  Moves */}
        <div className="grid grid-cols-6 gap-x-0.5 gap-y-2">
          {/* Move */}
          <div role="gridcell" className="col-span-3 grid grid-cols-1">
            {moves.map((move, i) => (
              <Select
                key={i}
                className="w-1/2"
                iconGetter={(k) => (
                  <Image
                    className="inline-block"
                    width={20}
                    height={20}
                    alt={k}
                    src={`${basePath}/assets/types/${gen.moves.get(k)?.type}.webp`}
                    loading="lazy"
                  />
                )}
                options={learnset.map((l) => ({
                  label: l.name,
                  value: l.name,
                }))}
                value={{ label: move.name, value: move.name }}
                onChange={(e) => {
                  const newMove = gen.moves.get(e.value);
                  if (newMove) {
                    setMoves(moves.map((m, j) => (j === i ? newMove : m)) as [Move, Move, Move, Move]);
                  }
                }}
              />
            ))}
          </div>
          {/*  Power inputs & crit switch */}
          <div role="gridcell" className="grid grid-rows-4">
            {moves.map((m, i) => (
              <div key={i} className="grid grid-cols-1">
                <input className="input-bordered input input-xs self-center" type="number" min="0" max="255" value={m.basePower} />
                <button
                  className={`self-center btn-xs btn ${crits[i] ? '' : 'btn-outline'}`}
                  onClick={() => setCrits(crits.map((c, j) => (j === i ? !c : c)) as [boolean, boolean, boolean, boolean])}
                >
                  Crit
                </button>
              </div>
            ))}
          </div>
          {/*  Move Type & Category select */}
          <div role="gridcell" className="col-span-2 grid grid-rows-4">
            {moves.map((move, i) => (
              <div key={i} className="grid grid-cols-1">
                <ValueWithEmojiSelector
                  options={typesWithEmoji}
                  enableEmojis={false}
                  className="select-bordered select-xs"
                  bindValue={move.type}
                  onChange={(e) =>
                    setMoves(
                      moves.map((m, j) =>
                        j === i
                          ? {
                              ...m,
                              type: e.target.value,
                            }
                          : m
                      ) as [Move, Move, Move, Move]
                    )
                  }
                />
                <ValueWithEmojiSelector
                  options={moveCategoriesWithEmoji}
                  enableEmojis={false}
                  className="select-bordered select-xs"
                  bindValue={move.category}
                  onChange={(e) =>
                    setMoves(
                      moves.map((m, j) =>
                        j === i
                          ? {
                              ...m,
                              category: e.target.value,
                            }
                          : m
                      ) as [Move, Move, Move, Move]
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
