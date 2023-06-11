import type { NextApiRequest, NextApiResponse } from 'next';

import FormatManager from '@/models/FormatManager';
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

  const formatManager = new FormatManager();
  const formatID = format && typeof format === 'string' && formatManager.isSupportedFormatId(format) ? format : formatManager.defaultFormat.id;

  return res.status(200).json(await postProcessUsage(formatID));
};

export default handler;
