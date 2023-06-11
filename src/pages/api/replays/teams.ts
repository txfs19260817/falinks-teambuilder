import type { replay } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import FormatManager from '@/models/FormatManager';
import { prisma } from '@/utils/Prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse<Partial<replay>[]>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  // - format
  // - species: string, comma separated list of species IDs
  const {
    query: { format, species },
  } = req;
  const formatManager = new FormatManager();
  const formatID = format && typeof format === 'string' && formatManager.isSupportedFormatId(format) ? format : formatManager.defaultFormat.id;
  const speciesArray = species && typeof species === 'string' ? species.split(',').sort() : [];

  // validate query
  if (speciesArray.length > 6 || speciesArray.length < 1) {
    return res.status(400);
  }

  const r = await prisma.replay.findMany({
    select: {
      id: true,
      uploadtime: true,
      p1: true,
      p2: true,
      p1team: true,
      p2team: true,
      rating: true,
    },
    where: {
      format: formatID,
      OR: [
        {
          p1team: {
            hasEvery: speciesArray,
          },
        },
        {
          p2team: {
            hasEvery: speciesArray,
          },
        },
      ],
    },
    orderBy: {
      uploadtime: 'desc',
    },
  });
  return res.status(200).json(r);
};

export default handler;
