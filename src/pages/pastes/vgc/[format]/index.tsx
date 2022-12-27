import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import PastesTable from '@/components/pastes/PastesTable';
import { FormatSelector } from '@/components/select/FormatSelector';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import type { PastesList } from '@/utils/Prisma';
import { listPastes } from '@/utils/Prisma';

const vgcFormats = [
  'gen9vgc2023series1',
  // 'gen8spikemuthcup', 'gen8battlestadiumdoublesseries13', 'gen8vgc2022'
];

const VGCPastes = ({ format, pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.vgc_pastes.title')} description={t('common.routes.vgc_pastes.description')}>
      <div className="flex gap-4">
        <FormatSelector
          formats={vgcFormats}
          defaultFormat={format}
          handleChange={(e) => {
            router.push(`/pastes/vgc/${e.target.value}`);
          }}
        />
        <button className="btn-primary btn-sm btn" onClick={() => router.push(`/pastes/vgc/${format}/insights`)}>
          {t('common.insights')} 📈
        </button>
      </div>
      <PastesTable pastes={pastes} enableSharedAt={true} />
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
        params: { format },
        locale,
      }))
    ) ?? vgcFormats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default VGCPastes;
