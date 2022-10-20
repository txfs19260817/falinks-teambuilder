import { NextApiRequest, NextApiResponse } from 'next';

import { getPaste, Paste } from '@/utils/Prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse<Paste>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const id = req.query.id as string | undefined;
  if (!id) {
    return res.status(400);
  }

  const p = await getPaste(id);
  if (!p) {
    return res.status(404);
  }
  return res.status(200).json(p);
};

export default handler;
