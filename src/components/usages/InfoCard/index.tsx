import { Icons, Sprites } from '@pkmn/img';
import Image from 'next/image';
import React, { useContext } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { fractionToPercentage } from '@/utils/Helpers';
import { wikiLink } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

function InfoCard({ pokeUsage }: { pokeUsage: Usage }) {
  const { gen } = useContext(DexContext);
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Avatar */}
      <PureSpriteAvatar url={Sprites.getPokemon(pokeUsage.name).url} />
      <div className="card-body">
        {/* Name */}
        <div className="card-title">
          <h2>{pokeUsage.name}</h2>
          {gen.dex.species.get(pokeUsage.name).types.map((type) => (
            <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} />
          ))}
        </div>
        {/* Abilities list */}
        <h3 className="font-bold">Abilities :</h3>
        <ol className="h-16">
          {Object.entries(pokeUsage.Abilities)
            .map(([ability, fraction]) => ({
              ability: gen.abilities.get(ability)!,
              fraction,
            }))
            .map(({ ability, fraction }, i) => (
              <li key={ability.name} className="before:content-['#']">
                <span>{i + 1}. </span>
                <a href={wikiLink(ability.name)} target="_blank" rel="noreferrer">
                  {ability.name}
                </a>
                <span> ({fractionToPercentage(fraction)})</span>
              </li>
            ))}
        </ol>
        <div className="card-actions justify-end">
          <a className="btn-primary btn-sm btn" href={wikiLink(pokeUsage.name)} target="_blank" rel="noreferrer">
            Check it in PokéDex
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
