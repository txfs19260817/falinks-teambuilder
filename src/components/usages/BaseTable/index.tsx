import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { fractionToPercentage } from '@/utils/Helpers';
import { getPokemonTranslationKey, wikiLink } from '@/utils/PokemonUtils';

type BaseTableProps<T = Record<string, number>> = {
  tableTitle: string;
  usages: T;
  nameGetter: (key: keyof T) => string;
  iconGetter?: (key: keyof T) => JSX.Element;
  category: 'species' | 'moves' | 'abilities' | 'items' | 'natures' | 'types';
};

function BaseTable({ tableTitle, usages, nameGetter, iconGetter, category }: BaseTableProps) {
  const translationNSs = ['usages', 'common', category];
  const { t } = useTranslation(translationNSs);
  const { locale } = useRouter();
  return (
    <table className="table-zebra table-compact table w-full">
      <thead>
        <tr>
          <th className="w-1/12">#</th>
          <th>{t(tableTitle, { ns: 'common' })}</th>
          <th className="w-1/12">%</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(usages).map(([key, value], i) => {
          const name = nameGetter(key as keyof typeof usages);
          return (
            <tr key={key}>
              <td>{i + 1}</td>
              <td>
                {iconGetter ? iconGetter(key as keyof typeof usages) : null}
                <a href={wikiLink(name, locale)} target="_blank" rel="noreferrer" aria-label="Open in wiki" title={t('usages.openInWiki')}>
                  {t(getPokemonTranslationKey(name, category), {
                    ns: translationNSs,
                    defaultValue: name,
                  })}
                </a>
              </td>
              <td>{fractionToPercentage(value)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default BaseTable;
