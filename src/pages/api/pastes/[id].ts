import { Filter, FindOptions, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { PokePaste } from '@/models/PokePaste';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

const collectionNames = [AppConfig.collectionName.userPastes, AppConfig.collectionName.vgcPastes];

const handler = async (req: NextApiRequest, res: NextApiResponse<PokePaste>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const id = req.query.id as string | undefined;
  if (!id || id === 'undefined') {
    return res.status(200).json(new PokePaste({ author: '', notes: '', paste: '', title: '' }));
  }

  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collections = collectionNames.map((cn) => db.collection<PokePaste>(cn));

  // eslint-disable-next-line no-restricted-syntax
  for (const collection of collections) {
    // eslint-disable-next-line no-await-in-loop
    const result = await collection.findOne({ _id: new ObjectId(id) } as Filter<PokePaste>, { _id: 0 } as FindOptions);
    if (result) {
      return res.status(200).json(result);
    }
  }

  return res.status(404);
};

export default handler;
