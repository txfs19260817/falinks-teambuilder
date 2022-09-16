import { WithId } from 'mongodb';
import { InferGetServerSidePropsType } from 'next';
import React from 'react';

import PastesTable from '@/components/pastes/PasteListTable';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

const PublicPastes = ({ pastes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Main title="Pastes">
      <PastesTable pastes={pastes} detailSubPath="public" />
    </Main>
  );
};

export const getServerSideProps: () => Promise<{
  props: { pastes: WithId<PokePaste>[] };
}> = async () => {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.publicPastes);
  const cursor = collection.find({});

  const pastes: WithId<PokePaste>[] = await cursor.toArray();
  await cursor.close();
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as WithId<PokePaste>[],
    },
  };
};

export default PublicPastes;
