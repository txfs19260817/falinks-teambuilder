import { useCombobox } from 'downshift';
import { useState } from 'react';

import { Option, SelectProps } from '@/utils/Types';

export const Select = ({ options, value, onChange, iconGetter, placeholder = '...', className = 'w-full' }: SelectProps<Option>) => {
  const getOptionsFilter = (inputValue?: Option['value']) => (option: Option) => !inputValue || option.value.toLowerCase().includes(inputValue.toLowerCase());
  const [items, setItems] = useState<Option[]>(options);
  const [selectedItem, setSelectedItem] = useState<Option | null | undefined>(value);
  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, highlightedIndex, getItemProps } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(options.filter(getOptionsFilter(inputValue)));
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
        <div className="input-group" {...getComboboxProps()}>
          <input type="search" placeholder={placeholder} className="input-bordered input w-full" {...getInputProps()} />
          <button aria-label="toggle menu" className="btn" type="button" {...getToggleButtonProps()}>
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>
      <ul {...getMenuProps()} className={`z-50 rounded-box absolute max-h-64 overflow-y-auto bg-base-100 shadow-md scrollbar-thin ${className}`}>
        {isOpen &&
          items.map((item, index) => (
            <li
              className={`p-1 flex flex-col ${highlightedIndex === index ? 'bg-base-300' : ''} ${selectedItem === item ? 'font-bold' : ''}`}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
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
