import { fractionToPercentage } from '@/utils/Helpers';
import { wikiLink } from '@/utils/PokemonUtils';

type BaseTableProps<T = Record<string, number>> = {
  tableTitle: string;
  usages: T;
  nameGetter: (key: keyof T) => string;
  iconGetter?: (key: keyof T) => JSX.Element;
};

function BaseTable({ tableTitle, usages, nameGetter, iconGetter }: BaseTableProps) {
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
                {iconGetter ? iconGetter(key as keyof typeof usages) : null}
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
