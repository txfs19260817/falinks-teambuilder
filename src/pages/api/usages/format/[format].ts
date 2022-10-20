import type { NextApiRequest, NextApiResponse } from 'next';

import { AppConfig } from '@/utils/AppConfig';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

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

  const r = await postProcessUsage(formatID);
  return res.status(200).json(r);
};

export default handler;
