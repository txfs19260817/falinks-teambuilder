import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import PastesTable from '@/components/pastes/PastesTable';
import { FormatSelector } from '@/components/select/FormatSelector';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import type { PastesList } from '@/utils/Prisma';
import { listPastes } from '@/utils/Prisma';

const vgcFormats = ['gen9vgc2023series1', 'gen8spikemuthcup', 'gen8battlestadiumdoublesseries13', 'gen8vgc2022'];

const VGCPastes = ({ format, pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  return (
    <Main title="Pastes">
      <FormatSelector
        formats={vgcFormats}
        defaultFormat={format}
        handleChange={(e) => {
          router.push(`/pastes/vgc/${e.target.value}`);
        }}
      />
      <PastesTable pastes={pastes} />
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ pastes: PastesList; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const pastes = await listPastes(format, true);

  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'create'])),
    },
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
    fallback: false,
  };
};

export default VGCPastes;
