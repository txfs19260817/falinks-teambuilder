import { Ability, AbilityName, Item, Move, Nature, Specie, TypeName } from '@pkmn/data';
import { SpeciesAbility } from '@pkmn/dex-types';
import { StatID, StatsTable, StatusName } from '@pkmn/types';
import { Pokemon } from '@smogon/calc';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import { CalculationsContext } from '@/components/calc/Context/CalculationsContext';
import { HpSetters } from '@/components/calc/HpSetters';
import { MovesSetters } from '@/components/calc/MovesSetters';
import { PlainSelect } from '@/components/calc/PlainSelect';
import { StatsPanel } from '@/components/calc/StatsPanel';
import { TypesSelectors } from '@/components/calc/TypesSelectors';
import { Select } from '@/components/select/Select';
import { BoostTable, defaultBoosts, defaultIvs, defaultStats, getMovesBySpecie, getPokemonIcon, StatusMap, statusMapValueToName } from '@/utils/PokemonUtils';

type PokemonInfoProps = {
  index: 1 | 2;
};

export const PokemonInfo = ({ index }: PokemonInfoProps) => {
  const { basePath } = useRouter();
  // data
  const { gen, pokemonPair } = useContext(CalculationsContext);
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
  const [boosts, setBoosts] = useState<BoostTable>(defaultBoosts);
  const [status, setStatus] = useState<StatusName | ''>('');
  // moves are selected 4 moves; learnset is all moves that Pokémon can learn
  const [moves, setMoves] = useState<[Move, Move, Move, Move]>([
    gen.moves.get('Thunderbolt')!,
    gen.moves.get('Flamethrower')!,
    gen.moves.get('Ice Beam')!,
    gen.moves.get('Earthquake')!,
  ]);
  const [crits, setCrits] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);
  const [learnset, setLearnset] = useState<Move[]>([]);
  const [dynamax, setDynamax] = useState(false);
  // readonly states
  const baseStats = useMemo<StatsTable>(() => pokemon.baseStats, [pokemon.name]);
  const stats = useMemo<StatsTable>(
    () =>
      Object.fromEntries(
        (Object.entries(baseStats) as Array<[StatID, number]>).map(([k, base]) => [k, gen.stats.calc(k, base, ivs[k], evs[k], level, nature)])
      ) as StatsTable,
    [baseStats, evs, gen, ivs, level, nature]
  );
  const [curHP, setCurHP] = useState(stats.hp);

  // Effects
  // update context when a Pokémon's properties are changed
  useEffect(() => {
    const oldPokemon = pokemonPair[index - 1]!.clone();
    oldPokemon.ability = ability.name;
    oldPokemon.item = item.name;
    oldPokemon.level = level;
    oldPokemon.nature = nature.name;
    oldPokemon.evs = evs;
    oldPokemon.ivs = ivs;
    oldPokemon.boosts = boosts as StatsTable;
    oldPokemon.status = status;
    oldPokemon.moves = moves.map((move) => move.name);
    oldPokemon.isDynamaxed = dynamax;

    pokemonPair.splice(index - 1, 1, oldPokemon);
  }, [ability, boosts, curHP, dynamax, evs, item, ivs, level, moves, nature, status]);
  // update some properties when Pokémon changes
  useEffect(() => {
    // update context
    const newPm = new Pokemon(gen, pokemon.name, {
      ability: pokemon.abilities[0],
      boosts: defaultStats,
      evs: defaultStats,
      item: pokemon.requiredItem ?? item.name,
      ivs: defaultIvs,
    });
    pokemonPair[index - 1] = newPm;
    // update states
    setTypes(pokemon.types);
    if (pokemon.requiredItem) {
      setItem(gen.items.get(pokemon.requiredItem)!);
    }
    setAbility(gen.abilities.get(pokemon.abilities[0])!);
    setAbilityTable(pokemon.abilities);
    setEvs(defaultStats);
    setIvs(defaultIvs);
    setBoosts(defaultBoosts);
    setStatus(newPm.status);
    setDynamax(false);
    getMovesBySpecie(gen, pokemon.name).then(setLearnset);
  }, [gen, pokemon]);

  return (
    <section className="mockup-window border bg-base-300">
      <h1 className="w-full border-b border-base-300 indent-3 text-xl font-bold">Pokemon {index}</h1>
      <div className="form-control gap-1 px-2">
        {/* Pokemon */}
        <Select
          className="w-5/6"
          options={pokemonList.map((p) => ({ value: p.name, label: p.name }))}
          onChange={(e) => {
            setPokemon(gen.species.get(e.value) ?? pokemon);
          }}
          value={{ value: pokemon.name, label: pokemon.name }}
          iconGetter={(key: string) => <span title={key} style={getPokemonIcon(undefined, key, true)}></span>}
        />
        {/* Types */}
        <div className="form-control xl:flex-row">
          <TypesSelectors
            types={types}
            onChangeType1={(e) => {
              const type1 = e.target.value as TypeName;
              const oldType2 = types[1];
              const newTypes: [TypeName] | [TypeName, TypeName] = oldType2 && oldType2.length > 0 ? [type1, oldType2] : [type1];
              setTypes(newTypes);
            }}
            onChangeType2={(e) => {
              const type2 = e.target.value as TypeName | '';
              const oldType1 = types[0];
              const newTypes: [TypeName] | [TypeName, TypeName] = type2 && type2.length > 0 ? [oldType1, type2] : [oldType1];
              setTypes(newTypes);
            }}
          />
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
        <StatsPanel baseStats={baseStats} ivs={ivs} setIvs={setIvs} evs={evs} setEvs={setEvs} stats={stats} boosts={boosts} setBoosts={setBoosts} />
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
        <HpSetters totalHP={stats.hp} currentHP={curHP} setCurrentHP={setCurHP} dynamax={dynamax} setDynamax={setDynamax} />
        {/*  Moves */}
        <div className="grid grid-cols-6 gap-x-0.5 gap-y-2">
          <MovesSetters gen={gen} crits={crits} setCrits={setCrits} moves={moves} setMoves={setMoves} learnset={learnset} basePath={basePath} />
        </div>
      </div>
    </section>
  );
};
