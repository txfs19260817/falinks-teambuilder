import { useTranslation } from 'next-i18next';
import { ChangeEvent } from 'react';

import { ValueWithEmojiOption } from '@/utils/Types';

type ValueWithEmojiSelectorProps<T extends string | boolean = string> = {
  options: ValueWithEmojiOption<T>[];
  bindValue?: string;
  className?: string;
  emptyOption?: string;
  enableEmojis?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
};

export const ValueWithEmojiSelector = <T extends string | boolean = string>({
  options,
  bindValue,
  onChange,
  className,
  emptyOption,
  ariaLabel,
  enableEmojis = true,
}: ValueWithEmojiSelectorProps<T>) => {
  const { t } = useTranslation(['common', 'types', 'categories']);
  return (
    <select className={`select ${className}`} value={bindValue} onChange={onChange} aria-label={ariaLabel} role="listbox">
      {emptyOption && <option value="">{emptyOption}</option>}
      {options.map(({ value, emoji }, j) => (
        <option key={j} value={value.toString()}>
          {enableEmojis && emoji} {typeof value === 'string' && t(value.toLowerCase(), { ns: ['types', 'categories'] })}
        </option>
      ))}
    </select>
  );
};
