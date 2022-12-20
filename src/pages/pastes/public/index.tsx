import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Main } from '@/templates/Main';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PastesTable from '@/components/pastes/PastesTable';
import type { PastesList } from '@/utils/Prisma';
import { listPastes } from '@/utils/Prisma';
import { useTranslation } from 'next-i18next';

const PublicPastes = ({ pastes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.public_pastes.title')} description={t('common.routes.public_pastes.description')}>
      <PastesTable pastes={pastes} />
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<{ pastes: PastesList }> = async (context) => {
  const pastes = await listPastes({ isOfficial: false, isPublic: true });
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as PastesList,
      ...(await serverSideTranslations(context.locale ?? 'en', ['common', 'species']))
    }
  };
};

export default PublicPastes;
