import { Dex } from '@pkmn/dex';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppConfig } from '@/utils/AppConfig';
import { ensureInteger } from '@/utils/Helpers';
import { prisma } from '@/utils/Prisma';

type Data = {
  id: string;
  paste: string;
  title: string;
  author: string;
};

const pageSize = 5;
const gen = Dex.forGen(AppConfig.defaultGen);

const handler = async (req: NextApiRequest, res: NextApiResponse<Data[]>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  const {
    query: { pokemon, page, format },
  } = req;
  // required (handle forms/baseSpecies ?)
  if (typeof pokemon !== 'string' || pokemon.length === 0) {
    return res.status(400);
  }
  // optional
  const pageNumber = ensureInteger(page, 1);

  // build search terms
  const searchTerms = [pokemon];
  const baseSpecies = gen.species.get(pokemon)?.baseSpecies;
  if (baseSpecies && baseSpecies !== pokemon) {
    searchTerms.push(baseSpecies);
  }
  // sanitize the input manually to search with input having space
  const searchTermsString = searchTerms.map((s) => s.split(' ').join('&')).join('&');

  // full-text search paste
  const results = await prisma.pokepaste.findMany({
    where: {
      isOfficial: true,
      format: typeof format === 'string' ? format : AppConfig.defaultFormat,
      paste: {
        search: searchTermsString,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: pageNumber > 0 ? (pageNumber - 1) * 5 : 0,
    take: pageSize,
  });

  // only preserve the wanted Pokémon in paste
  const returnedSets: Data[] = results.map((p) => {
    const { id, paste, author, title } = p;
    const pm = paste.split(/\r\n\r\n|\n\n/).find((t) => t.includes(pokemon));
    return { id, paste: pm ?? paste, author, title };
  });

  return res.status(200).json(returnedSets);
};

export default handler;
