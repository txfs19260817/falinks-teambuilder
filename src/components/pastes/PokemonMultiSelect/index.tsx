import { useCombobox, useMultipleSelection } from 'downshift';
import React, { useMemo, useState } from 'react';

type Option = {
  label: string;
  value: string;
};

type PokemonMultiSelectProps = {
  options: Option[];
  onChange?: (selected: Option[]) => void;
  iconGetter?: (key: string) => JSX.Element;
};

export function PokemonMultiSelect({ options, onChange, iconGetter }: PokemonMultiSelectProps) {
  const getFilteredOptions = (selectedOptions: Option[], inputValue: Option['value']) => {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return options.filter((o) => !selectedOptions.includes(o) && o.value.toLowerCase().includes(lowerCasedInputValue));
  };

  const [inputValue, setInputValue] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const items = useMemo<Option[]>(() => getFilteredOptions(selectedOptions, inputValue), [selectedOptions, inputValue]);
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection({
    selectedItems: selectedOptions,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedOptions(newSelectedItems ?? []);
          onChange?.(newSelectedItems ?? []);
          break;
        default:
          break;
      }
    },
  });

  const { isOpen, getMenuProps, getInputProps, getComboboxProps, getItemProps, toggleMenu, highlightedIndex, selectedItem } = useCombobox({
    items,
    itemToString(item) {
      return item?.label ?? item?.value ?? '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {
              isOpen: true,
              highlightedIndex: 0,
            }),
          };
        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedOption }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedOption) {
            const newSelectedOptions = [...selectedOptions, newSelectedOption];
            setSelectedOptions(newSelectedOptions);
            onChange?.(newSelectedOptions);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue ?? '');
          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-neutral shadow-sm">
          <div className="flex grow gap-0.5" {...getComboboxProps()}>
            {selectedOptions.map((option, index) => (
              <span
                className="self-center"
                key={option.value}
                {...getSelectedItemProps({
                  selectedItem: option,
                  index,
                })}
              >
                {iconGetter ? iconGetter(option.value) : <span>{option.label}</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(option);
                  }}
                >
                  ╳
                </button>
              </span>
            ))}
            <input
              placeholder="Pokemon..."
              className="input-bordered input input-sm w-full border-none focus:outline-none"
              {...getInputProps(
                getDropdownProps({
                  preventKeyAction: isOpen,
                  onFocus: () => {
                    toggleMenu();
                  },
                })
              )}
            />
          </div>
        </div>
      </div>
      <ul {...getMenuProps()} className="absolute max-h-64 w-full overflow-y-auto bg-base-100 shadow-md">
        {isOpen &&
          items.map((option, index) => (
            <li
              className={`p-1 flex flex-col ${highlightedIndex === index ? 'bg-base-300' : ''} ${selectedItem === option ? 'font-bold' : ''}`}
              key={option.value}
              {...getItemProps({
                item: option,
                index,
                // reset the input value when an item is selected
                onClick: () => {
                  setInputValue('');
                },
              })}
            >
              <span>
                {iconGetter ? iconGetter(option.value) : <span>{option.label}</span>}
                <span>{option.label}</span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
