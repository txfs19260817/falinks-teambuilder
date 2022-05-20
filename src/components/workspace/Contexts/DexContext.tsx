import { Generation, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { createContext, ReactNode } from 'react';

import { Usage } from '@/components/workspace/types';

interface DexContextInterface {
  gen: Generation;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  usages: Usage[];
}

type DexContextProviderProps = {
  children: ReactNode;
  value: DexContextInterface;
};

// pokemon dex instance
const defaultDex: DexContextInterface = {
  gen: new Generations(Dex).get(8),
  globalFilter: '',
  setGlobalFilter: (_filter: string) => {},
  usages: [],
};

// create context
export const DexContext = createContext<DexContextInterface>(defaultDex);

// Provider in app
export const DexContextProvider = ({ children, value }: DexContextProviderProps) => <DexContext.Provider value={value}>{children}</DexContext.Provider>;
