import { Filter, FindOptions, ObjectId } from 'mongodb';
import { GetServerSideProps } from 'next';

import PasteLayout from '@/components/pastes/PasteLayout';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

export default function PasteId({ data }: { data: PokePaste }) {
  return (
    <Main title={`Paste - ${data.title}`}>
      <PasteLayout paste={new PokePaste(data)} />
    </Main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (typeof id !== 'string') {
    return {
      notFound: true,
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
        },
      }
    : {
        notFound: true,
      };
};
