import { Generation, GenerationNum, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { Data } from '@pkmn/dex-types';
import { createContext, ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

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
export const defaultDex: DexContextInterface = {
  gen: new Generations(Dex, (d: Data) => {
    if (!d.exists) return false;
    if ('isNonstandard' in d && d.isNonstandard) return d.isNonstandard === 'Gigantamax';
    if (d.kind === 'Ability' && d.id === 'noability') return false;
    return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
  }).get(AppConfig.defaultGen as GenerationNum),
  globalFilter: '',
  setGlobalFilter: (_: string) => {},
};

// create context
export const DexContext = createContext<DexContextInterface>(defaultDex);

// Provider in app
export const DexContextProvider = ({ children, value }: DexContextProviderProps) => <DexContext.Provider value={value}>{children}</DexContext.Provider>;
