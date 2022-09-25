import { Icons } from '@pkmn/img';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useId, useState } from 'react';
import { MovesetStatistics } from 'smogon';

import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const Index = ({ usages }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const drawerID = useId();
  const [selectedPokemon, setSelectedPokemon] = useState<ArrayElement<typeof usages> | undefined>(usages[0]);
  const [pokemonNameFilter, setPokemonNameFilter] = useState<string>('');
  return (
    <Main title={'Usages'}>
      {/* Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button */}
      <div className="drawer-mobile drawer">
        <input id={drawerID} type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar w-full bg-base-300 lg:hidden">
            <div className="flex-none">
              <label htmlFor={drawerID} className="btn-ghost btn-square btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">Usages</div>
          </div>
          {selectedPokemon && (
            <pre>
              <code>{JSON.stringify(selectedPokemon, null, 2)}</code>
            </pre>
          )}
        </div>
        <div className="drawer-side">
          <label htmlFor={drawerID} className="drawer-overlay"></label>
          <ul className="menu rounded-r-box w-80 overflow-y-auto border border-base-content/30 bg-base-300 p-4">
            <label className="input-group-sm input-group">
              <span>Pokémon</span>
              <input
                type="text"
                className="input-ghost input input-sm bg-base-200 text-base-content placeholder:text-neutral focus:bg-base-100"
                placeholder="Filter by name"
                value={pokemonNameFilter}
                onChange={(e) => setPokemonNameFilter(e.target.value)}
              />
            </label>
            {usages
              .filter((usage) => usage.name.toLowerCase().includes(pokemonNameFilter.toLowerCase()))
              .map((usage) => (
                <li key={usage.name}>
                  <button type="button" className="btn-ghost btn-block btn m-1 w-full bg-base-100 text-sm" onClick={() => setSelectedPokemon(usage)}>
                    <span style={convertStylesStringToObject(Icons.getPokemon(usage.name).style)} />
                    <span>{usage.name}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ usages: (MovesetStatistics & { name: string })[] } & SSRConfig> = async ({ locale }) => {
  let endpoint = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
  if (!endpoint.startsWith('http')) {
    endpoint = `https://${endpoint}`;
  }
  const usages = await fetch(`${endpoint}/api/usages/format/gen8vgc2022`).then((res) => res.json());
  return {
    props: {
      usages,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};

export default Index;
