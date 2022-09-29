import { Filter, FindOptions, ObjectId } from 'mongodb';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PasteLayout from '@/components/pastes/PasteLayout';

export default function PasteId({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main title={`Paste - ${data.title}`}>
      <PasteLayout paste={new PokePaste(data)} />
    </Main>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: PokePaste }> = async (context) => {
  const { id } = context.query;
  if (typeof id !== 'string') {
    return {
      notFound: true
    };
  }

  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const data = await db
    .collection<PokePaste>(AppConfig.collectionName.publicPastes)
    .findOne({ _id: new ObjectId(id) } as Filter<PokePaste>, { _id: 0 } as FindOptions);

  return data
    ? {
      props: {
        data: JSON.parse(JSON.stringify(data)) as PokePaste,
        ...(await serverSideTranslations(context.locale ?? 'en', ['common']))
      }
    }
    : {
      notFound: true
    };
};
