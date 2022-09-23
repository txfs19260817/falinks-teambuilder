import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';

import PasteLayout from '@/components/pastes/PasteLayout';
import { PokePaste } from '@/models/PokePaste';
import Loading from '@/templates/Loading';
import { Main } from '@/templates/Main';

export default function PasteId() {
  const { isReady, query, push } = useRouter();
  const { data, error } = useSWR<PokePaste>(isReady ? `/api/pastes/${query.id}` : null, (url) => fetch(url).then((res) => res.json()));

  if (error) {
    push('/404');
    return null;
  }

  return <Main title={`Paste - ${data?.title ?? 'Loading'}`}>{data ? <PasteLayout paste={new PokePaste(data)} /> : <Loading />}</Main>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', ['common'])),
    },
  };
};
