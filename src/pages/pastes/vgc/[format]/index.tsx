import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import PastesTable from '@/components/pastes/PastesTable';
import { FormatInputGroupSelector, formatOptionElements } from '@/components/select/FormatSelector';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import type { PastesList } from '@/utils/Prisma';
import { listPastes } from '@/utils/Prisma';
import type { Format } from '@/utils/Types';

const vgcFormats: Format[] = new FormatManager().vgcFormats.filter((f) => f.gen === 9);

const VGCPastes = ({ format, pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { push } = useRouter();
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.vgc_pastes.title')} description={t('common.routes.vgc_pastes.description')}>
      <FormatInputGroupSelector defaultFormat={format} onChange={(e) => push(`/pastes/vgc/${e.target.value}`)} options={formatOptionElements(vgcFormats)} />
      <PastesTable pastes={pastes} enableDateShared={true} />
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ pastes: PastesList; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const pastes = await listPastes({ format, isOfficial: true });

  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'species'])),
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      vgcFormats.map((format) => ({
        params: { format: format.id },
        locale,
      }))
    ) ?? vgcFormats.map((format) => ({ params: { format: format.id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default VGCPastes;
