import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { formatOptionElementsGrouped, FormatSelector } from '@/components/select/FormatSelector';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

export function TeamMetaSetters() {
  const { t } = useTranslation(['common']);
  const { teamState, formatManager } = useContext(StoreContext);

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      <FormatSelector
        className="select-bordered select select-sm w-full md:select-md"
        defaultFormat={teamState.format}
        onChange={(e) => {
          teamState.format = (e.target as HTMLSelectElement).value;
        }}
        options={formatOptionElementsGrouped(formatManager.groupFormatsByGen())}
      />
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
