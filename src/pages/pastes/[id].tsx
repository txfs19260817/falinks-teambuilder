import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SWRConfig } from 'swr';

import { Main } from '@/components/layout/Main';
import PasteLayout from '@/components/pastes/PasteLayout';
import DexSingleton from '@/models/DexSingleton';
import FormatManager from '@/models/FormatManager';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { getPaste, listPastesIDs } from '@/utils/Prisma';

// eslint-disable-next-line no-use-before-define
export default function Page({ fallback, id, title }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SWRConfig value={{ fallback }}>
      <Main title={title} description={`Paste - ${title}`}>
        <PasteLayout id={id} />
      </Main>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps<{ id: string; title: string; fallback: { [p: string]: any } } & SSRConfig, { id: string }> = async ({
  params,
  locale,
}) => {
  if (!params) return { notFound: true };

  const { id } = params;
  const data = await getPaste(id);
  if (data == null) return { notFound: true };

  const team = Pokemon.convertPasteToTeam(data.paste);
  if (team == null) return { notFound: true };

  // Slim down the SSR translations to only the ones we need
  const dex = DexSingleton.getGen();
  const requiredNamespaces = ['common', 'paste', 'moves', 'types', 'species', 'categories', 'items', 'abilities', 'natures'] as const;
  const ssr = await serverSideTranslations(locale ?? AppConfig.defaultLocale, Array.from(requiredNamespaces));

  const initialI18nStore = ssr._nextI18Next!.initialI18nStore as Record<
    'en' | 'de' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'zh-Hans' | 'zh-Hant',
    Record<(typeof requiredNamespaces)[number], Record<string, string>> // the inner Record is the JSON translation object
  >;

  ssr._nextI18Next!.initialI18nStore = Object.fromEntries(
    Object.entries(initialI18nStore).map(([loc, namespaces]) => [
      loc,
      Object.fromEntries(
        Object.entries(namespaces).map(([namespace, translations]) => {
          // namespaces to be trimmed: 'moves', 'species', 'items', 'abilities', 'natures'
          switch (namespace) {
            case 'moves': {
              const moveIDs = team.flatMap((p) => p.moves).map((m) => dex.moves.get(m)?.id ?? '') as string[];
              return [namespace, Object.fromEntries(Object.entries(translations).filter(([key]) => moveIDs.includes(key)))];
            }
            case 'items': {
              const itemIDs = team.map((p) => dex.items.get(p.item)?.id ?? '') as string[];
              return [namespace, Object.fromEntries(Object.entries(translations).filter(([key]) => itemIDs.includes(key)))];
            }
            case 'abilities': {
              const abilityIDs = team.map((p) => dex.abilities.get(p.ability)?.id ?? '') as string[];
              return [namespace, Object.fromEntries(Object.entries(translations).filter(([key]) => abilityIDs.includes(key)))];
            }
            case 'natures': {
              const natures = team.map((p) => p.nature.toLowerCase());
              return [namespace, Object.fromEntries(Object.entries(translations).filter(([key]) => natures.includes(key)))];
            }
            default:
              return [namespace, translations];
          }
        }),
      ),
    ]),
  );

  return {
    props: {
      id,
      title: data.title,
      fallback: {
        [id]: JSON.parse(JSON.stringify(data)),
      },
      ...ssr,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  // Only pre-render the official & the latest format pastes to save available routes
  const ids = await listPastesIDs({
    isPublic: true,
    isOfficial: true,
    format: FormatManager.defaultFormatId,
  }).then((r) => r.map(({ id }) => id));

  const paths =
    context.locales?.flatMap((locale) =>
      ids.map((id) => ({
        params: { id },
        locale,
      })),
    ) ?? ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};
