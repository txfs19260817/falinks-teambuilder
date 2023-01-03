import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useId, useMemo, useState } from 'react';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { FormatSelector } from '@/components/select/FormatSelector';
import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import { PokemonFilter } from '@/components/usages/PokemonFilter';
import { SpreadTable } from '@/components/usages/SpreadTable';
import UsageStats from '@/components/usages/UsageStats';
import DexSingleton from '@/models/DexSingleton';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const UsagePage = ({ usages, format }: { usages: Usage[]; format: string }) => {
  const drawerID = useId();
  const { push } = useRouter();
  const { t } = useTranslation(['common']);
  const [selectedRank, setSelectedRank] = useState<number>(usages?.at(0)?.rank ?? 0);
  const pokeUsage = useMemo<Usage | undefined>(() => {
    return (usages || []).find((u) => u.rank === selectedRank);
  }, [selectedRank, usages]);

  return (
    <Main title={t('common.usage')}>
      {/* Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button */}
      <div className="drawer-mobile drawer h-main">
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
            <div className="mx-2 flex-1 px-2">
              {t('common.usage')} - {format}
            </div>
          </nav>
          {/* Main Content */}
          {pokeUsage && (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {/* Info Card */}
              <InfoCard speciesName={pokeUsage.name} />
              {/* Usage */}
              <UsageStats pokeUsage={pokeUsage} />
              {/* Items table */}
              <BaseTable
                tableTitle="items"
                category="items"
                usages={pokeUsage.Items as Record<string, number>}
                nameGetter={(k) => DexSingleton.getGen().items.get(k)?.name ?? k}
                iconGetter={(k) => <ItemIcon itemName={k} />}
              />
              {/* Moves table */}
              <BaseTable
                tableTitle="moves"
                category="moves"
                usages={pokeUsage.Moves as Record<string, number>}
                nameGetter={(k) => DexSingleton.getGen().moves.get(k)?.name ?? k}
                iconGetter={(k) => <RoundTypeIcon typeName={DexSingleton.getGen().moves.get(k)?.type ?? '???'} />}
              />
              {/* Teammates table */}
              <BaseTable
                tableTitle="teammates"
                category="species"
                usages={pokeUsage.Teammates as Record<string, number>}
                nameGetter={(k) => DexSingleton.getGen().species.get(k)?.name ?? k}
                iconGetter={(k) => <PokemonIcon speciesId={k} />}
              />
              {/* Spreads table */}
              <SpreadTable usages={pokeUsage.Spreads as Record<string, number>} />
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
            <PokemonFilter usages={usages} drawerID={drawerID} setSelectedRank={setSelectedRank} />
          </ul>
        </div>
      </div>
    </Main>
  );
};

function Page(data: InferGetStaticPropsType<typeof getStaticProps>) {
  return <UsagePage {...data} />;
}

export const getStaticProps: GetStaticProps<{ usages: Usage[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const usages = await postProcessUsage(format);
  const N = 100;

  return {
    props: {
      // pick the top N entries
      usages: usages.slice(0, N),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'natures', 'types'])),
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
