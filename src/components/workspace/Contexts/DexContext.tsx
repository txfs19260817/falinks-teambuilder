import { Generation, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { createContext, ReactNode } from 'react';

interface DexContextInterface {
  gen: Generation;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
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
};

// create context
export const DexContext = createContext<DexContextInterface>(defaultDex);

// Provider in app
export const DexContextProvider = ({ children, value }: DexContextProviderProps) => <DexContext.Provider value={value}>{children}</DexContext.Provider>;
