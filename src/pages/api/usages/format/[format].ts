import type { ID } from '@pkmn/data';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppConfig } from '@/utils/AppConfig';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const fallbackFormat = 'gen9battlestadiumdoubles' as ID; // TODO: update it when comes to the first gen9 format

const handler = async (req: NextApiRequest, res: NextApiResponse<Usage[]>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  const {
    query: { format },
  } = req;
  // optional, but if not provided, 404 will be returned
  const formatID = format && typeof format === 'string' ? format : AppConfig.defaultFormat;

  let r = await postProcessUsage(formatID);
  // TODO: a hotfix to remedy the lack of data for 'gen9vgc2023series1' format
  if (!r.length && formatID === 'gen9vgc2023series1') {
    r = await postProcessUsage(fallbackFormat);
    const namesToDrop = new Set([
      'Galarian Meowth',
      'Wooper',
      'Quagsire',
      'Perrserker',
      'Great Tusk',
      'Brute Bonnet',
      'Sandy Shocks',
      'Scream Tail',
      'Flutter Mane',
      'Slither Wing',
      'Roaring Moon',
      'Iron Treads',
      'Iron Moth',
      'Iron Hands',
      'Iron Jugulis',
      'Iron Thorns',
      'Iron Bundle',
      'Iron Valiant',
      'Ting-Lu',
      'Chien-Pao',
      'Wo-Chien',
      'Chi-Yu',
      'Koraidon',
      'Miraidon',
    ]);
    r = r.filter((e) => !namesToDrop.has(e.name));
  }
  return res.status(200).json(r);
};

export default handler;
