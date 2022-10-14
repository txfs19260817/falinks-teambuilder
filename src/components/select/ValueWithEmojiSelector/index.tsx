import { ChangeEvent } from 'react';

import { ValueWithEmojiOption } from '@/utils/Types';

type ValueWithEmojiSelectorProps = {
  options: ValueWithEmojiOption[];
  bindValue?: string;
  className?: string;
  emptyOption?: string;
  enableEmojis?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const ValueWithEmojiSelector = ({ options, bindValue, onChange, className, emptyOption, enableEmojis = true }: ValueWithEmojiSelectorProps) => {
  return (
    <select className={`select ${className}`} value={bindValue} onChange={onChange}>
      {emptyOption && <option value="">{emptyOption}</option>}
      {options.map(({ value, emoji }, j) => (
        <option key={j} value={value}>
          {enableEmojis && emoji} {value}
        </option>
      ))}
    </select>
  );
};
