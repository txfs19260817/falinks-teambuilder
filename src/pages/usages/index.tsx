import { Icons } from '@pkmn/img';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useContext, useId, useState } from 'react';
import useSWR, { SWRConfig } from 'swr';

import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import UsageStats from '@/components/usages/UsageStats';
import { defaultDex, DexContext, DexContextProvider } from '@/components/workspace/Contexts/DexContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const UsagePage = () => {
  const drawerID = useId();
  const { gen } = useContext(DexContext);
  const { data } = useSWR<Usage[]>(`/api/usages/format/${AppConfig.defaultFormat}`, (u) => fetch(u).then((res) => res.json()));
  const [selectedPokemon, setSelectedPokemon] = useState<Usage | undefined>(data?.at(0));
  const [pokemonNameFilter, setPokemonNameFilter] = useState<string>('');
  return (
    <Main title={'Usages'}>
      {/* Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button */}
      <div className="drawer-mobile drawer">
        <input id={drawerID} type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-base-300">
          <div className="navbar rounded-box w-full shadow-2xl lg:hidden">
            <div className="flex-none">
              <label htmlFor={drawerID} className="btn-ghost btn-square btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">Usages</div>
          </div>
          {/* Main Content */}
          {selectedPokemon && (
            <div className="grid grid-cols-2 gap-4 p-4">
              {/* Info Card */}
              <InfoCard pokeUsage={selectedPokemon} />
              {/* Usage */}
              <UsageStats pokeUsage={selectedPokemon} />
              {/* Items Table */}
              <BaseTable
                tableTitle="Items"
                usages={selectedPokemon.Items as Record<string, number>}
                nameGetter={(k) => gen.items.get(k)?.name ?? k}
                iconStyleGetter={(k) => Icons.getItem(k).css}
              />
              {/* Moves Table */}
              <BaseTable
                tableTitle="Moves"
                usages={selectedPokemon.Moves as Record<string, number>}
                nameGetter={(k) => gen.moves.get(k)?.name ?? k}
                iconStyleGetter={(k) => Icons.getType(gen.moves.get(k)?.type ?? '???').url}
              />
              {/* Teammates Table */}
              <BaseTable
                tableTitle="Teammates"
                usages={selectedPokemon.Teammates as Record<string, number>}
                nameGetter={(k) => gen.species.get(k)?.name ?? k}
                iconStyleGetter={(k) => Icons.getPokemon(k).css}
              />
              {/* Spreads Table */}
              <BaseTable tableTitle="Spreads" usages={selectedPokemon.Spreads as Record<string, number>} nameGetter={(k) => k} iconStyleGetter={(_) => ({})} />
            </div>
          )}
        </div>
        {/* Drawer side */}
        <div className="drawer-side">
          <label htmlFor={drawerID} className="drawer-overlay"></label>
          <ul className="menu rounded-r-box w-80 overflow-y-auto border border-base-content/30 bg-base-200 p-4">
            <label className="input-group-xs input-group">
              <span>Pokémon</span>
              <input
                type="text"
                className="input-ghost input input-sm bg-base-100 text-base-content placeholder:text-neutral focus:bg-base-100"
                placeholder="Filter by name"
                value={pokemonNameFilter}
                onChange={(e) => setPokemonNameFilter(e.target.value)}
              />
            </label>
            {(data || [])
              .filter((usage) => usage.name.toLowerCase().includes(pokemonNameFilter.toLowerCase()))
              .map((usage) => (
                <li key={usage.name}>
                  <a type="button" className="btn-ghost btn-block btn m-1 w-full bg-base-100 text-xs" onClick={() => setSelectedPokemon(usage)}>
                    <span style={convertStylesStringToObject(Icons.getPokemon(usage.name).style)} />
                    <span>{usage.name}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Main>
  );
};

function Page({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SWRConfig value={{ fallback }}>
      <DexContextProvider value={defaultDex}>
        <UsagePage />
      </DexContextProvider>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps<{ fallback: { [p: string]: Usage[] } } & SSRConfig> = async ({ locale }) => {
  const usages = await postProcessUsage(AppConfig.defaultFormat);
  return {
    props: {
      fallback: {
        '/api/usages/format/gen8vgc2022': usages, // NOTE: this is a hack to make the SWR work. Update this when `defaultFormat` is changed
      },
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};

export default Page;
