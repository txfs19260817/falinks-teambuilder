import { Generations, ID } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { DisplayUsageStatistics, Smogon } from '@pkmn/smogon';
import { NextApiRequest, NextApiResponse } from 'next';

import FormatManager from '@/models/FormatManager';
import { AppConfig } from '@/utils/AppConfig';
import { ensureInteger } from '@/utils/Helpers';

const gens = new Generations(Dex);
const smogon = new Smogon(fetch);
const formatManager = new FormatManager();
const fallbackFormat = 'gen9battlestadiumdoubles' as ID;

/**
 * @swagger
 * /api/usages/stats/{pokemon}:
 *  get:
 *    description: Usage statistics for a Pokémon. Mainly used by the Team Builder to sort items, moves, abilities, etc. by usage.
 *    parameters:
 *    - in: path
 *      name: pokemon
 *      schema:
 *        type: string
 *        required: true
 *        example: "Gengar"
 *      description: The Pokémon species to get the usage statistics for.
 *      required: true
 *    - in: query
 *      name: format
 *      schema:
 *        type: string
 *        required: false
 *        default: "gen8battlestadiumdoubles"
 *      description: The format to get the usage statistics for.
 *    - in: query
 *      name: gen
 *      schema:
 *        type: integer
 *        required: false
 *        default: 9
 *      description: The generation to get the usage statistics for.
 */
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
  const generation = gens.get(ensureInteger(gen, AppConfig.defaultGen));
  const formatID = <ID>(format && typeof format === 'string' ? format : formatManager.defaultFormat.id);

  // get stats and return
  let r: DisplayUsageStatistics | undefined;
  try {
    r = await smogon.stats(generation, pokemon, formatID);
  } catch (e) {
    r = await smogon.stats(generation, pokemon, fallbackFormat);
  }

  if (r == null) {
    return res.status(404);
  }
  return res.status(200).json(r);
};

export default handler;
