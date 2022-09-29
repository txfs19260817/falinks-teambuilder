import { WithId } from 'mongodb';
import { InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import PastesTable from '@/components/pastes/PastesTable';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

const VGCPastes = ({ pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Main title="Pastes">
      <PastesTable pastes={pastes} detailSubPath="vgc" />
    </Main>
  );
};

export const getStaticProps: ({ locale }: { locale: string }) => Promise<{
  props: { pastes: WithId<PokePaste>[] };
}> = async ({ locale }) => {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes);
  const cursor = collection.find({}).sort({ _id: 1 });

  const pastes: WithId<PokePaste>[] = await cursor.toArray();
  await cursor.close();
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as WithId<PokePaste>[],
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default VGCPastes;
