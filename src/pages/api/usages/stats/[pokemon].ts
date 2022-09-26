import { Generations, ID } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { Smogon } from '@pkmn/smogon';
import { NextApiRequest, NextApiResponse } from 'next';

import { AppConfig } from '@/utils/AppConfig';
import { ensureInteger } from '@/utils/Helpers';

const gens = new Generations(Dex);
const smogon = new Smogon(fetch);

const handler = async (req: NextApiRequest, res: NextApiResponse<Awaited<ReturnType<Smogon['stats']>>>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  const {
    query: { pokemon, gen, format },
  } = req;
  // required
  if (typeof pokemon !== 'string' || pokemon.length === 0) {
    return res.status(400);
  }
  // optional
  const generation = gens.get(<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>ensureInteger(gen, AppConfig.defaultGen));
  const formatID = <ID>(format && typeof format === 'string' ? format : AppConfig.defaultFormat);

  // get stats and return
  const r = await smogon.stats(generation, pokemon, formatID);
  if (r == null) {
    return res.status(404);
  }
  return res.status(200).json(r);
};

export default handler;
