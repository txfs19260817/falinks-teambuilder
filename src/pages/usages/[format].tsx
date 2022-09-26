import { Icons } from '@pkmn/img';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { ChangeEvent, useContext, useId, useState } from 'react';

import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import UsageStats from '@/components/usages/UsageStats';
import { defaultDex, DexContext, DexContextProvider } from '@/components/workspace/Contexts/DexContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const formats = ['gen8vgc2022', 'gen8ou', 'gen8bdspou'];

function PokemonFilter(props: { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="input-group-xs input-group">
      <span>Pokémon</span>
      <input
        type="text"
        className="input-ghost input input-sm bg-base-100 text-base-content placeholder:text-neutral focus:bg-base-100"
        placeholder="Filter by name"
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
}

const UsagePage = ({ data }: { data: Usage[] }) => {
  const drawerID = useId();
  const { basePath, query, push } = useRouter();
  const { gen } = useContext(DexContext);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
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
          {data.at(selectedIndex) && (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {/* Info Card */}
              <InfoCard pokeUsage={data.at(selectedIndex)!} />
              {/* Usage */}
              <UsageStats pokeUsage={data.at(selectedIndex)!} />
              {/* Items Table */}
              <BaseTable
                tableTitle="Items"
                usages={data.at(selectedIndex)!.Items as Record<string, number>}
                nameGetter={(k) => gen.items.get(k)?.name ?? k}
                iconStyleGetter={(k) => Icons.getItem(k).css}
              />
              {/* Moves Table */}
              <BaseTable
                tableTitle="Moves"
                usages={data.at(selectedIndex)!.Moves as Record<string, number>}
                nameGetter={(k) => gen.moves.get(k)?.name ?? k}
                iconImagePathGetter={(k) => `${basePath}/assets/types/${gen.moves.get(k)?.type}.webp`}
              />
              {/* Teammates Table */}
              <BaseTable
                tableTitle="Teammates"
                usages={data.at(selectedIndex)!.Teammates as Record<string, number>}
                nameGetter={(k) => gen.species.get(k)?.name ?? k}
                iconStyleGetter={(k) => Icons.getPokemon(k).css}
              />
              {/* Spreads Table */}
              <BaseTable
                tableTitle="Spreads"
                usages={data.at(selectedIndex)!.Spreads as Record<string, number>}
                nameGetter={(k) => k}
                iconStyleGetter={(_) => ({})}
              />
            </div>
          )}
        </div>
        {/* Drawer side */}
        <div className="drawer-side">
          <label htmlFor={drawerID} className="drawer-overlay"></label>
          <ul className="menu rounded-r-box w-80 overflow-y-auto border border-base-content/30 bg-base-200 p-4">
            <div className="input-group-xs input-group">
              <span>Format</span>
              <select
                className="select-bordered select select-sm"
                defaultValue={query.format ?? AppConfig.defaultFormat}
                onChange={(e) => {
                  push(`/usages/${e.target.value}`);
                }}
              >
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <PokemonFilter value={pokemonNameFilter} onChange={(e) => setPokemonNameFilter(e.target.value)} />
            {(data || [])
              .filter((usage) => usage.name.toLowerCase().includes(pokemonNameFilter.toLowerCase()))
              .map((usage, i) => (
                <li key={usage.name}>
                  <a type="button" className="btn-ghost btn-block btn m-1 w-full bg-base-100 text-xs" onClick={() => setSelectedIndex(i)}>
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

function Page({ usages }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DexContextProvider value={defaultDex}>
      <UsagePage data={usages} />
    </DexContextProvider>
  );
}

export const getStaticProps: GetStaticProps<{ usages: Usage[] } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const usages = await postProcessUsage(format);
  return {
    props: {
      usages,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
    revalidate: 604800, // 1 week
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      formats.map((format) => ({
        params: { format },
        locale,
      }))
    ) ?? formats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: true,
  };
};

export default Page;
