import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import type { PairUsage } from '@/utils/Types';

type PairUsageTableProps = {
  pairUsages: PairUsage[];
  minimumCount?: number;
  nResults?: number;
};

const PairUsageTable = ({ pairUsages, nResults, minimumCount = 2 }: PairUsageTableProps) => {
  const { t } = useTranslation(['usages', 'common', 'species']);
  const total = useMemo(() => pairUsages.reduce((acc, { count }) => acc + count, 0), []);
  return (
    <table className="table-zebra table w-full">
      <thead>
        <tr>
          <th colSpan={2}>{t('usages.pair')}</th>
          <th>% ({t('common.count')})</th>
        </tr>
      </thead>
      <tbody>
        {pairUsages
          .slice(0, nResults ?? pairUsages.length)
          .filter(({ count }) => count >= minimumCount)
          .map(({ count, pair }) => (
            <tr key={pair}>
              {pair
                .split(',')
                .map((s) => s.toLowerCase())
                .map((speciesId) => (
                  <td key={speciesId}>
                    <figure className="inline-block w-full">
                      <PureSpriteAvatar speciesId={speciesId} showName={true} />
                    </figure>
                  </td>
                ))}
              <td>
                {((count / total) * 100).toFixed(2)}% ({count})
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PairUsageTable;
