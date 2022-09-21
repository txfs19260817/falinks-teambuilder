import { Filter, FindOptions, ObjectId } from 'mongodb';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export async function getStaticProps({ params, locale }: { params: { id: string }; locale: string }) {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const data = await db
    .collection<PokePaste>(AppConfig.collectionName.vgcPastes)
    .findOne({ _id: new ObjectId(params.id) } as Filter<PokePaste>, { _id: 0 } as FindOptions);

  return data
    ? {
        props: {
          data: JSON.parse(JSON.stringify(data)) as PokePaste,
          ...(await serverSideTranslations(locale, ['common'])),
        },
      }
    : {
        notFound: true,
      };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes); // only generate static pages for vgc pastes
  const cursor = collection.find({}, { projection: { _id: 1, title: 0, author: 0, paste: 0, notes: 0 } });

  const data = await collection.find().toArray();
  const paths = data.map(({ _id }: { _id: ObjectId }) => `/pastes/vgc/${_id.toString()}`);
  await cursor.close();

  return {
    paths: paths || [],
    fallback: false,
  };
};
