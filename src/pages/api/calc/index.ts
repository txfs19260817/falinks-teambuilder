import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { calculate, Move, Pokemon } from '@smogon/calc';
import { NextApiRequest, NextApiResponse } from 'next';

import { AppConfig } from '@/utils/AppConfig';

const gen = new Generations(Dex).get(AppConfig.defaultGen);
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    // return res.status(405).json({ message: 'only POST requests are allowed' });
  }
  const result = calculate(
    gen,
    new Pokemon(gen, 'Gengar', {
      item: 'Choice Specs',
      nature: 'Timid',
      evs: { spa: 252 },
      boosts: { spa: 1 },
    }),
    new Pokemon(gen, 'Chansey', {
      item: 'Eviolite',
      nature: 'Calm',
      evs: { hp: 252, spd: 252 },
    }),
    new Move(gen, 'Focus Blast')
  );
  return res.status(200).json({ damage: result.damage, desc: result.desc() });
};

export default handler;
