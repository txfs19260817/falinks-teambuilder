import { NextApiRequest, NextApiResponse } from 'next';

import { PokePaste } from '@/models/PokePaste';
import { AppConfig } from '@/utils/AppConfig';
import { ensureInteger } from '@/utils/Helpers';
import clientPromise from '@/utils/MongoDB';

const agg = (query: string, pageNumber: number = 0) => {
  const pageSize = 5;
  return [
    {
      // with Atlas Search support
      $search: {
        compound: {
          must: [
            {
              text: {
                query,
                path: 'paste',
              },
            },
            {
              text: {
                query: 'EVs:',
                path: 'paste',
              },
            },
          ],
          mustNot: [
            {
              text: {
                query: '🔐',
                path: 'title',
              },
            },
          ],
        },
      },
    },
    {
      $skip: pageNumber > 0 ? (pageNumber - 1) * pageSize : 0,
    },
    {
      $limit: pageSize,
    },
    {
      $project: {
        _id: 0,
        title: 1,
        author: 1,
        paste: 1,
      },
    },
  ];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<PokePaste[]>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  const {
    query: { pokemon, page },
  } = req;
  // required
  if (typeof pokemon !== 'string' || pokemon.length === 0) {
    return res.status(400);
  }
  // optional
  const pageNumber = ensureInteger(page, 1);

  // search
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes);
  const cursor = collection.aggregate<PokePaste>(agg(pokemon, pageNumber));
  const pokePastes = await cursor.toArray();
  await cursor.close();

  // only preserve the wanted Pokémon in paste
  const filteredPokePastes = pokePastes.map((pokePaste) => {
    const { paste } = pokePaste;
    paste.split(/\r\n\r\n|\n\n/).forEach((pm) => {
      if (pm.includes(pokemon)) {
        pokePaste.paste = pm;
      }
    });
    return pokePaste;
  });

  return res.status(200).json(filteredPokePastes);
};

export default handler;
