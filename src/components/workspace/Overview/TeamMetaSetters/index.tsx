import { useTranslation } from 'next-i18next';
import { useContext, useMemo } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

const legacyFormats = [
  // gen 1
  'gen1ou',
  'gen1uu',
  // gen 2
  'gen2ou',
  'gen2uu',
  // gen 3
  'gen3ou',
  'gen3uu',
  // gen 4
  'gen4ou',
  'gen4zu',
  // gen 5
  'gen5ou',
  // gen 6
  'gen6ou',
  'gen6doublesou',
  // gen 7
  'gen7ou',
  'gen7doublesou',
  'gen7ubers',
  'gen7mixandmega',
  // gen 8
  'gen8ou',
  'gen8uu',
  'gen8doublesou',
  'gen8battlestadiumsingles',
  'gen8bdspou',
  'gen8nationaldex',
  // vgc
  'vgc2014',
  'vgc2015',
  'gen6vgc2016',
  'gen7vgc2017',
  'gen7vgc2018',
  'gen7vgc2019ultraseries',
];

export function TeamMetaSetters() {
  const { t } = useTranslation(['common']);
  const { teamState } = useContext(StoreContext);
  const formatOptions = useMemo(() => {
    return [...AppConfig.formats, ...legacyFormats];
  }, []);
  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      <select
        className="select-bordered select select-sm w-full md:select-md"
        title={t('common.format')}
        value={teamState.format}
        onChange={(e) => {
          teamState.format = (e.target as HTMLSelectElement).value;
        }}
      >
        <option disabled={true}>{t('common.format')}</option>
        {formatOptions.map((format) => (
          <option key={format} value={format}>
            {format}
          </option>
        ))}
      </select>
      <input
        className="input-bordered input input-sm w-full md:input-md"
        type="text"
        title={t('common.title')}
        placeholder={t('common.title')}
        value={teamState.title}
        onChange={(e) => {
          teamState.title = (e.target as HTMLInputElement).value;
        }}
      />
    </div>
  );
}
