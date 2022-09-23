import { Filter, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { PokePaste } from '@/models/PokePaste';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

// This collection names array has order of priority.
// When this API is called, it is likely to fetch a private paste,
// as other pastes have been already statically generated.
const collectionNames = [AppConfig.collectionName.privatePastes, AppConfig.collectionName.publicPastes, AppConfig.collectionName.vgcPastes];

const handler = async (req: NextApiRequest, res: NextApiResponse<PokePaste>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const id = req.query.id as string | undefined;
  if (!id) {
    return res.status(400);
  }

  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);

  // eslint-disable-next-line no-restricted-syntax
  for (const cn of collectionNames) {
    const collection = db.collection<PokePaste>(cn);
    // eslint-disable-next-line no-await-in-loop
    const result = await collection.findOne({
      _id: new ObjectId(id),
    } as Filter<PokePaste>);
    if (result) {
      res.status(200).json(result);
    }
  }

  return res.status(404);
};

export default handler;
