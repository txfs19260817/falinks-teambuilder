import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Main } from '@/templates/Main';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PastesTable from '@/components/pastes/PastesTable';
import type { PastesList } from '@/utils/Prisma';
import { listPastes } from '@/utils/Prisma';

const PublicPastes = ({ pastes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Main title='Pastes'>
      <PastesTable pastes={pastes} />
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<{ pastes: PastesList }> = async (context) => {
  const pastes = await listPastes(undefined, false, true, false);
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as PastesList,
      ...(await serverSideTranslations(context.locale ?? 'en', ['common', 'create']))
    }
  };
};

export default PublicPastes;
