import { Team } from '@pkmn/sets';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  jsonPaste: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ jsonPaste: '' });
  }

  // get the data from the request body and validate it
  if (!req.body?.paste) {
    return res.status(400).json({ jsonPaste: '' });
  }

  // return the JSON
  const jsonPaste = Team.fromString(req.body.paste)?.toJSON() ?? '';
  return res.status(200).json({ jsonPaste });
};

export default handler;
