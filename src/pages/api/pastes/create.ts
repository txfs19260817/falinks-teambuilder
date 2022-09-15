import type { NextApiRequest, NextApiResponse } from 'next';

import { PokePaste } from '@/models/PokePaste';
import { AppConfig } from '@/utils/AppConfig';
import clientPromise from '@/utils/MongoDB';

type Data = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'only POST requests are allowed' });
  }
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.userPastes);
  const paste = req.body as PokePaste;
  const result = await collection.insertOne(paste);

  return res.redirect(302, `/pastes/${result.insertedId.toHexString()}`);
};

export default handler;
