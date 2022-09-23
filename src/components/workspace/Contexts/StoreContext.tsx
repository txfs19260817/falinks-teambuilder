import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { createContext, Dispatch, ReactNode } from 'react';

import { FocusedFieldAction, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import { Pokemon } from '@/models/Pokemon';
import { TeamChangelog } from '@/models/TeamChangelog';

export type Metadata = {
  title: string;
  notes: string;
  authors: string[];
  roomName: string;
};

export type StoreContextType = {
  team: Pokemon[];
  metadata: Metadata;
  notes: any;
  history: TeamChangelog[];
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
