import { createContext, Dispatch, ReactNode } from 'react';

import { FocusedFieldAction, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { TeamState } from '@/models/TeamState';

interface StoreContextInterface {
  teamState: TeamState;
  tabIdx: number;
  setTabIdx: (tab: number) => void;
  focusedFieldState: FocusedFieldToIdx;
  focusedFieldDispatch: Dispatch<FocusedFieldAction>;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

type StoreContextProviderProps = {
  children: ReactNode;
  value: StoreContextInterface;
};

const defaultStore: StoreContextInterface = {
  teamState: {} as TeamState,
  tabIdx: 0,
  setTabIdx: (_tab: number) => {},
  focusedFieldState: { Species: 0 },
  focusedFieldDispatch: (_: FocusedFieldAction) => {},
  globalFilter: '',
  setGlobalFilter: (_: string) => {},
};

export const StoreContext = createContext<StoreContextInterface>(defaultStore);

export const StoreContextProvider = ({ children, value }: StoreContextProviderProps) => <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
