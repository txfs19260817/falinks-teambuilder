import { useTranslation } from 'next-i18next';
import type { ChangeEvent } from 'react';

import type { Format } from '@/utils/Types';

export const formatOptionElement = (formats: Pick<Format, 'name' | 'id'>): JSX.Element => (
  <option key={formats.id} value={formats.id}>
    {formats.name}
  </option>
);

export const formatOptionElements = (formats: Format[]): JSX.Element[] => formats.map(formatOptionElement);

export const formatOptionElementsGrouped = (groupedFormats: Format[][]): JSX.Element[] =>
  groupedFormats.map((formatsPerGen, i) => (
    <optgroup label={`Gen ${i}`} key={i}>
      {formatOptionElements(formatsPerGen)}
    </optgroup>
  ));

type FormatSelectorProps = {
  defaultFormat: string; // format id
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  options?: JSX.Element[]; // formatOptionElements or formatOptionElementsGrouped
};

export const FormatSelector = ({ defaultFormat, onChange, options, className = 'select-bordered select select-sm overflow-ellipsis' }: FormatSelectorProps) => {
  const { t } = useTranslation(['common']);
  return (
    <select className={className} defaultValue={defaultFormat} onChange={onChange} role="listbox" aria-label="Format Selector" title={t('common.format')}>
      {options}
    </select>
  );
};

export const FormatInputGroupSelector = ({
  defaultFormat,
  onChange,
  options,
  className = 'select-bordered select select-sm w-64 overflow-ellipsis',
  inputGroupClassName = 'input-group-xs input-group',
}: FormatSelectorProps & { inputGroupClassName?: string }) => {
  const { t } = useTranslation(['common']);
  return (
    <div className={inputGroupClassName}>
      <span className="whitespace-nowrap">{t('common.format')}</span>
      <select className={className} defaultValue={defaultFormat} onChange={onChange} role="listbox" aria-label="Format Selector" title={t('common.format')}>
        {options}
      </select>
    </div>
  );
};
