import type { NextApiRequest, NextApiResponse } from 'next';

import { Pokemon } from '@/models/Pokemon';
import { createPaste, Paste } from '@/utils/Prisma';

type Data = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'only POST requests are allowed' });
  }

  // get the data from the request body and validate it
  const paste: Paste = { ...req.body, isOfficial: false };
  if (!paste || !paste.paste || !Pokemon.convertPasteToTeam(paste.paste)) {
    return res.status(400).json({ message: 'invalid paste' });
  }

  // save paste
  try {
    const created = await createPaste(paste);
    // redirect to the paste page
    return res.redirect(302, `/pastes/${created.id}`);
  } catch (e) {
    return res.status(500).json({ message: 'error creating paste' });
  }
};

export default handler;
