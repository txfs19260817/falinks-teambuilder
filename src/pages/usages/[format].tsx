import { Icons } from '@pkmn/img';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useId, useState } from 'react';

import { FormatSelector } from '@/components/select/FormatSelector';
import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import { PokemonFilter } from '@/components/usages/PokemonFilter';
import { PokemonList } from '@/components/usages/PokemonList';
import UsageStats from '@/components/usages/UsageStats';
import { defaultDex, DexContext, DexContextProvider } from '@/components/workspace/Contexts/DexContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const UsagePage = ({ usages, format }: { usages: Usage[]; format: string }) => {
  const drawerID = useId();
  const { basePath, push } = useRouter();
  const { gen } = useContext(DexContext);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [pokemonNameFilter, setPokemonNameFilter] = useState<string>('');

  return (
    <Main title={'Usages'}>
      {/* Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button */}
      <div className="drawer-mobile drawer">
        <input id={drawerID} type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-base-300">
          {/* nav that only shows on mobile */}
          <nav className="navbar rounded-box w-full shadow-2xl lg:hidden">
            <div className="flex-none">
              <label htmlFor={drawerID} className="btn-ghost btn-square btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">Usages - {format}</div>
          </nav>
          {/* Main Content */}
          {Array.isArray(usages) && usages.length > selectedIndex && (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {/* Info Card */}
              <InfoCard pokeUsage={usages.at(selectedIndex)!} />
              {/* Usage */}
              <UsageStats pokeUsage={usages.at(selectedIndex)!} />
              {/* Items table */}
              <BaseTable
                tableTitle="Items"
                usages={usages.at(selectedIndex)!.Items as Record<string, number>}
                nameGetter={(k) => gen.items.get(k)?.name ?? k}
                iconGetter={(k) => <span style={Icons.getItem(k).css} />}
              />
              {/* Moves table */}
              <BaseTable
                tableTitle="Moves"
                usages={usages.at(selectedIndex)!.Moves as Record<string, number>}
                nameGetter={(k) => gen.moves.get(k)?.name ?? k}
                iconGetter={(k) => (
                  <Image
                    className="inline-block"
                    width={24}
                    height={24}
                    alt={k}
                    title={k}
                    src={`${basePath}/assets/types/${gen.moves.get(k)?.type}.webp`}
                    loading="lazy"
                  />
                )}
              />
              {/* Teammates table */}
              <BaseTable
                tableTitle="Teammates"
                usages={usages.at(selectedIndex)!.Teammates as Record<string, number>}
                nameGetter={(k) => gen.species.get(k)?.name ?? k}
                iconGetter={(k) => <span style={Icons.getPokemon(k).css} />}
              />
              {/* Spreads table */}
              <BaseTable tableTitle="Spreads" usages={usages.at(selectedIndex)!.Spreads as Record<string, number>} nameGetter={(k) => k} />
            </div>
          )}
        </div>
        {/* Drawer side */}
        <div className="drawer-side">
          <label htmlFor={drawerID} className="drawer-overlay"></label>
          <ul className="menu rounded-r-box w-80 border border-base-content/30 bg-base-200 p-4">
            <FormatSelector
              defaultFormat={format}
              handleChange={(e) => {
                push(`/usages/${e.target.value}`);
              }}
            />
            <PokemonFilter value={pokemonNameFilter} onChange={(e) => setPokemonNameFilter(e.target.value)} />
            <PokemonList usages={usages} pokemonNameFilter={pokemonNameFilter} drawerID={drawerID} setSelectedIndex={setSelectedIndex} />
          </ul>
        </div>
      </div>
    </Main>
  );
};

function Page(data: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DexContextProvider value={defaultDex}>
      <UsagePage {...data} />
    </DexContextProvider>
  );
}

export const getStaticProps: GetStaticProps<{ usages: Usage[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const usages = await postProcessUsage(format);
  return {
    props: {
      usages,
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
    revalidate: 604800, // 1 week
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      AppConfig.formats.map((format) => ({
        params: { format },
        locale,
      }))
    ) ?? AppConfig.formats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: true,
  };
};

export default Page;
