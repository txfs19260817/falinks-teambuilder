import { useTranslation } from 'next-i18next';
import { ChangeEvent } from 'react';

import { ValueWithEmojiOption } from '@/utils/Types';

type ValueWithEmojiSelectorProps = {
  options: ValueWithEmojiOption[];
  bindValue?: string;
  className?: string;
  emptyOption?: string;
  enableEmojis?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
};

export const ValueWithEmojiSelector = ({
  options,
  bindValue,
  onChange,
  className,
  emptyOption,
  ariaLabel,
  enableEmojis = true,
}: ValueWithEmojiSelectorProps) => {
  const { t } = useTranslation(['common', 'types', 'categories']);
  return (
    <select className={`select ${className}`} value={bindValue} onChange={onChange} aria-label={ariaLabel} role="listbox">
      {emptyOption && <option value="">{emptyOption}</option>}
      {options.map(({ value, emoji }, j) => (
        <option key={j} value={value}>
          {enableEmojis && emoji} {t(value.toLowerCase(), { ns: ['types', 'categories'] })}
        </option>
      ))}
    </select>
  );
};
