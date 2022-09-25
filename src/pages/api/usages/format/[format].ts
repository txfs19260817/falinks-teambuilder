import { NextApiRequest, NextApiResponse } from 'next';
import { MovesetStatistics, Statistics } from 'smogon';

import { filterObjectByValue, limitObjectEntries, sortObjectByValue } from '@/utils/Helpers';

const defaultFormat = 'gen8vgc2022';
const { url, latestDate, process } = Statistics;

type Modify<T, R> = Omit<T, keyof R> & R;
type Usage = Modify<
  MovesetStatistics,
  {
    Items: Partial<MovesetStatistics['Items']>;
    Moves: Partial<MovesetStatistics['Moves']>;
    Spreads: Partial<MovesetStatistics['Spreads']>;
    Teammates: Partial<MovesetStatistics['Teammates']>;
  }
> & { name: string };

const trimUsage = (oldUsage: MovesetStatistics & { name: string }) => {
  const { Abilities, Items, Spreads, Teammates, Moves } = oldUsage;
  const newAbilities = sortObjectByValue(Abilities, (a, b) => (b ?? 0) - (a ?? 0));
  const newItems = sortObjectByValue(
    filterObjectByValue(Items, (v) => v > 0.1),
    (a, b) => (b ?? 0) - (a ?? 0)
  );
  const newSpreads = limitObjectEntries(
    sortObjectByValue(
      filterObjectByValue(Spreads, (v) => v > 0.1),
      (a, b) => (b ?? 0) - (a ?? 0)
    ),
    10
  );
  const newTeammates = limitObjectEntries(
    sortObjectByValue(
      filterObjectByValue(Teammates, (v) => v > 0.1),
      (a, b) => (b ?? 0) - (a ?? 0)
    ),
    20
  );
  const newMoves = sortObjectByValue(
    filterObjectByValue(Moves, (v) => v > 0.1),
    (a, b) => (b ?? 0) - (a ?? 0)
  );
  delete newMoves[''];
  return {
    ...oldUsage,
    Abilities: newAbilities,
    Items: newItems,
    Moves: newMoves,
    Spreads: newSpreads,
    Teammates: newTeammates,
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Usage[]>) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  // parse query
  const {
    query: { format },
  } = req;
  // optional, but if not provided, 404 will be returned
  const formatID = format && typeof format === 'string' ? format : defaultFormat;

  const latest = await latestDate(formatID, true);
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-11
  const date = latest?.date ?? month === 0 ? `${year}-${`${month}`.padStart(2, '0')}` : `${year - 1}-12`;
  const stats = process(await fetch(url(date, formatID)).then((r) => r.text()));
  const sortedStats = Object.entries(stats.data)
    .map(([name, obj]) => ({ name, ...obj }))
    .sort((a, b) => b.usage - a.usage)
    .map(trimUsage);
  return res.status(200).json(sortedStats);
};

export default handler;
