import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { createContext, ReactNode } from 'react';

import { FocusedFieldToIdx } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';

export type StoreContextType = {
  team: Pokemon[];
};

interface StoreContextInterface {
  teamState: MappedTypeDescription<StoreContextType>;
  tabIdx: number;
  setTabIdx: (tab: number) => void;
  focusedField: FocusedFieldToIdx;
  setFocusedField: (field: FocusedFieldToIdx) => void;
}

type StoreContextProviderProps = {
  children: ReactNode;
  value: StoreContextInterface;
};

const defaultStore: StoreContextInterface = {
  teamState: {} as MappedTypeDescription<StoreContextType>,
  tabIdx: 0,
  setTabIdx: (_tab: number) => {},
  focusedField: { Species: 0 },
  setFocusedField: (_field: FocusedFieldToIdx) => {},
};

export const StoreContext = createContext<StoreContextInterface>(defaultStore);

export const StoreContextProvider = ({ children, value }: StoreContextProviderProps) => <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
