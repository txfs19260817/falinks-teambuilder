import Image from 'next/image';

import { fractionToPercentage } from '@/utils/Helpers';
import { wikiLink } from '@/utils/PokemonUtils';

type BaseTableProps<T = Record<string, number>> = {
  tableTitle: string;
  usages: T;
  nameGetter: (key: keyof T) => string;
  // CSS properties or URL
  iconStyleGetter?: (key: keyof T) => { [p: string]: string | number };
  iconImagePathGetter?: (key: keyof T) => string;
};

function BaseTable({ tableTitle, usages, nameGetter, iconStyleGetter, iconImagePathGetter }: BaseTableProps) {
  const IconComponent = ({ k }: { k: string }) => {
    if (iconStyleGetter) {
      return <span style={iconStyleGetter(k)} />;
    }
    if (iconImagePathGetter) {
      return <Image className="inline-block" width={24} height={24} alt={k} title={k} src={iconImagePathGetter(k)} loading="lazy" />;
    }
    return null;
  };
  return (
    <table className="table-zebra table-compact table w-full">
      <thead>
        <tr>
          <th className="w-1/12">#</th>
          <th>{tableTitle}</th>
          <th className="w-1/12">Usage</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(usages).map(([key, value], i) => {
          const name = nameGetter(key as keyof typeof usages);
          return (
            <tr key={key}>
              <td>{i + 1}</td>
              <td>
                <IconComponent k={key} />
                <a href={wikiLink(name)} target="_blank" rel="noreferrer" title="Open in wiki">
                  {name}
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
