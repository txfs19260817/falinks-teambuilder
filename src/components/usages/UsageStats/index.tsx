import DexSingleton from '@/models/DexSingleton';
import { fractionToPercentage } from '@/utils/Helpers';
import { wikiLink } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

function UsageStats({ pokeUsage }: { pokeUsage: Usage }) {
  const abilities = Object.entries(pokeUsage.Abilities).map(([ability, fraction]) => ({
    ability: DexSingleton.getGen().abilities.get(ability)!,
    fraction,
  }));
  return (
    <div className="flex items-center justify-center">
      <div className="stats stats-vertical shadow xl:stats-horizontal xl:grid-cols-4">
        {/* Rank */}
        <div className="stat">
          <div className="stat-figure block text-secondary xl:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
            </svg>
          </div>
          <div className="stat-title">Rank</div>
          <div className="stat-value"># {pokeUsage.rank + 1}</div>
        </div>
        {/* Usage percent */}
        <div className="stat">
          <div className="stat-figure block text-accent xl:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <div className="stat-title">Usage</div>
          <div className="stat-value">{fractionToPercentage(pokeUsage.usage)}</div>
          <div className="stat-desc">last month</div>
        </div>
        {/* Abilities */}
        <div className="stat col-span-2 overflow-hidden">
          <div className="stat-title">Abilities</div>
          {abilities.at(0) && (
            <div className="stat-value text-xl text-primary before:content-['#']">
              <span>1. </span>
              <a href={wikiLink(abilities.at(0)!.ability.name)} target="_blank" rel="noreferrer">
                {abilities.at(0)!.ability.name}
              </a>
              <span> ({fractionToPercentage(abilities.at(0)!.fraction)})</span>
            </div>
          )}
          {abilities.at(1) && (
            <div className="stat-desc text-secondary before:content-['#']">
              <span>2. </span>
              <a href={wikiLink(abilities.at(1)!.ability.name)} target="_blank" rel="noreferrer">
                {abilities.at(1)!.ability.name}
              </a>
              <span> ({fractionToPercentage(abilities.at(1)!.fraction)})</span>
            </div>
          )}
          {abilities.at(2) && (
            <div className="stat-desc before:content-['#']">
              <span>3. </span>
              <a href={wikiLink(abilities.at(2)!.ability.name)} target="_blank" rel="noreferrer">
                {abilities.at(2)!.ability.name}
              </a>
              <span> ({fractionToPercentage(abilities.at(2)!.fraction)})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsageStats;
