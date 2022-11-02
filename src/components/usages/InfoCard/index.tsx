import { Sprites } from '@pkmn/img';

import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import DexSingleton from '@/models/DexSingleton';
import { wikiLink } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

function InfoCard({ pokeUsage }: { pokeUsage: Usage }) {
  const { types, baseStats } = DexSingleton.getDex().species.get(pokeUsage.name);
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Avatar */}
      <PureSpriteAvatar url={Sprites.getPokemon(pokeUsage.name).url} />
      <div className="card-body">
        {/* Name */}
        <div className="card-title">
          <h2>{pokeUsage.name}</h2>
        </div>
        {/* Content */}
        <div role="list" className="grid lg:grid-cols-2">
          <div role="listitem">
            <h3 className="font-bold">Types : </h3>
            <div className="flex flex-row gap-2">
              {types.map((typeName) => (
                <RoundTypeIcon key={typeName} typeName={typeName} />
              ))}
            </div>
          </div>
          <div role="listitem">
            {/* Abilities list */}
            <h3 className="font-bold">Base : </h3>
            {Object.entries(baseStats).map(([key, value]) => (
              <div role="progressbar" key={key} className="flex flex-wrap items-center justify-between px-1 text-sm">
                <label className="w-10 flex-none uppercase">{key}: </label>
                <meter className="w-full flex-1" min={0} max={256} low={80} high={100} optimum={130} value={value} title={`${value}`} />
                <label className="w-10">{value}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Card Buttons */}
        <div className="card-actions justify-end">
          <a className="btn-primary btn-sm btn" href={wikiLink(pokeUsage.name)} target="_blank" rel="noreferrer">
            Open in PokéDex
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
