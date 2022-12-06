import { useTranslation } from 'next-i18next';

import { fractionToPercentage } from '@/utils/Helpers';
import { wikiLink } from '@/utils/PokemonUtils';

type SpreadTableProps = {
  usages: Record<string, number>;
};

export function SpreadTable({ usages }: SpreadTableProps) {
  const { t } = useTranslation(['common']);
  const spreads = Object.keys(usages).map((key) => {
    const spreadPair = key.split(':', 2) as [string, string];
    return {
      nature: spreadPair[0],
      evsLiteral: spreadPair[1],
    };
  });
  return (
    <table className="table-zebra table-compact table w-full">
      <thead>
        <tr>
          <th className="w-1/12">#</th>
          <th>{t('common.nature')}</th>
          <th>{t('common.spread')}</th>
          <th className="w-1/12">%</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(usages).map((value, i) => {
          const { nature, evsLiteral } = spreads[i]!;
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <a href={wikiLink(nature)} target="_blank" rel="noreferrer" aria-label="Open in wiki" title={t('usages.openInWiki')}>
                  {t(nature.toLowerCase(), {
                    defaultValue: nature,
                    ns: 'natures',
                  })}
                </a>
              </td>
              <td>{evsLiteral}</td>
              <td>{fractionToPercentage(value)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
