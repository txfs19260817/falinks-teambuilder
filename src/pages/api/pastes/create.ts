import type { NextApiRequest, NextApiResponse } from 'next';

import { Pokemon } from '@/models/Pokemon';
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

  // get the data from the request body and validate it
  const paste = req.body as PokePaste;
  if (!paste || !paste.paste || !Pokemon.convertPasteToTeam(paste.paste)) {
    return res.status(400).json({ message: 'invalid paste' });
  }
  // save pastes privately by default
  const isPublic = req.query.public === 'true';
  const targetCollectionName = isPublic ? AppConfig.collectionName.publicPastes : AppConfig.collectionName.privatePastes;

  // save the paste to the database
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(targetCollectionName);
  const result = await collection.insertOne(paste);

  // redirect to the paste page
  return res.redirect(302, `/pastes/${isPublic ? 'public' : 'private'}/${result.insertedId.toHexString()}`);
};

export default handler;
