import type { NextApiRequest, NextApiResponse } from 'next';

import { listPastesSelect, PastesList, prisma } from '@/utils/Prisma';
import type { SearchPasteForm } from '@/utils/Types';

const handler = async (req: NextApiRequest, res: NextApiResponse<PastesList>) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  // get the data from the request body and validate it
  if (!req.body) {
    return res.status(400);
  }
  const { format, hasRentalCode } = req.body as SearchPasteForm;

  // search for pastes in jsonPaste JSONB field
  const results = await prisma.pokepaste.findMany({
    select: listPastesSelect,
    where: {
      format,
      rentalCode: hasRentalCode ? { not: null } : undefined,
    },
  });
  return res.status(200).json(results);
};

export default handler;
