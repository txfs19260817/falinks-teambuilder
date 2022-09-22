import { WithId } from 'mongodb';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

import PastesTable from '@/components/pastes/PasteListTable';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PublicPastes = ({ pastes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Main title='Pastes'>
      <PastesTable pastes={pastes} detailSubPath='public' />
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<{ pastes: WithId<PokePaste>[] }> = async (context) => {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.publicPastes);
  const cursor = collection.find({}).sort({ _id: 1 });

  const pastes: WithId<PokePaste>[] = await cursor.toArray();
  await cursor.close();
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as WithId<PokePaste>[],
      ...(await serverSideTranslations(context.locale ?? 'en', ['common']))
    }
  };
};

export default PublicPastes;
