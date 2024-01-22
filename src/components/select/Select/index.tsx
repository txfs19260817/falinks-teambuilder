import { useCombobox } from 'downshift';
import { useId, useMemo, useState } from 'react';

import type { Option, SelectProps } from '@/utils/Types';

export const Select = ({
  options,
  value,
  onChange,
  iconGetter,
  defaultValue,
  placeholder = '...',
  itemClassName = 'w-full',
  inputSize = 'md',
  ariaLabel = 'Select',
}: SelectProps<Option>) => {
  // A filter predicate to filter the options based on the input value
  // If the input value is empty, return all options; otherwise, find in option values first, then in option labels
  const getOptionsFilter =
    (input?: string) =>
    ({ label, value: optVal }: Option) =>
      !input || optVal.toLowerCase().includes(input.toLowerCase()) || label.includes(input);
  const inputId = useId();
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<Option | null | undefined>(value);
  const items = useMemo(() => options.filter(getOptionsFilter(inputValue)), [inputValue, options]);
  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    onInputValueChange(changes) {
      const newInputValue = changes.inputValue ?? '';
      setInputValue(newInputValue);
      // if user clears the input, reset the selected item
      if (newInputValue.length === 0 && defaultValue) {
        setSelectedItem(defaultValue);
        if (onChange) {
          onChange(defaultValue);
        }
      }
    },
    items,
    selectedItem,
    itemToString: (item: Option | null) => (item ? item.label : ''),
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      if (onChange && newSelectedItem) {
        onChange(newSelectedItem);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="form-control gap-1">
        <div className="join">
          <input
            {...getInputProps()}
            id={inputId}
            type="search"
            role="listbox"
            aria-label={ariaLabel}
            placeholder={placeholder}
            className={`input join-item input-bordered w-full ${
              inputSize === 'xs' ? 'input-xs' : inputSize === 'sm' ? 'input-sm' : inputSize === 'lg' ? 'input-lg' : ''
            }`}
          />
          <button
            className={`btn join-item ${inputSize === 'xs' ? 'btn-xs' : inputSize === 'sm' ? 'btn-sm' : inputSize === 'lg' ? 'btn-lg' : ''}`}
            type="button"
            role="button"
            aria-label="toggle menu"
            {...getToggleButtonProps()}
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>
      <ul {...getMenuProps()} className={`absolute z-50 max-h-64 overflow-y-auto rounded-box bg-base-100 shadow-md scrollbar-thin ${itemClassName}`}>
        {isOpen &&
          items.map((item, index) => (
            <li
              className={`flex flex-col p-1 ${highlightedIndex === index ? 'bg-base-300' : ''} ${selectedItem === item ? 'font-bold' : ''}`}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
              aria-label={item.label}
            >
              <span>
                {iconGetter && iconGetter(item.value)}
                <span>{item.label}</span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};
