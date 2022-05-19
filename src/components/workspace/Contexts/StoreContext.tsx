import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { createContext, Dispatch, ReactNode } from 'react';

import { FocusedFieldAction, FocusedFieldToIdx, Metadata } from '@/components/workspace/types';
import { Pokemon } from '@/models/Pokemon';

export type StoreContextType = {
  team: Pokemon[];
  metadata: Metadata;
};

interface StoreContextInterface {
  teamState: MappedTypeDescription<StoreContextType>;
  tabIdx: number;
  setTabIdx: (tab: number) => void;
  focusedFieldState: FocusedFieldToIdx;
  focusedFieldDispatch: Dispatch<FocusedFieldAction>;
}

type StoreContextProviderProps = {
  children: ReactNode;
  value: StoreContextInterface;
};

const defaultStore: StoreContextInterface = {
  teamState: {} as MappedTypeDescription<StoreContextType>,
  tabIdx: 0,
  setTabIdx: (_tab: number) => {},
  focusedFieldState: { Species: 0 },
  focusedFieldDispatch: (_field: FocusedFieldAction) => {},
};

export const StoreContext = createContext<StoreContextInterface>(defaultStore);

export const StoreContextProvider = ({ children, value }: StoreContextProviderProps) => <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
