import { Generation, GenerationNum, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { createContext, ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

interface DexContextInterface {
  gen: Generation;
}

type DexContextProviderProps = {
  children: ReactNode;
};

// pokemon dex instance
const dex: DexContextInterface = {
  gen: new Generations(Dex).get(AppConfig.defaultGen as GenerationNum),
};

// create context
export const DexContext = createContext<DexContextInterface>(dex);

// Provider in app
export const DexContextProvider = ({ children }: DexContextProviderProps) => <DexContext.Provider value={dex}>{children}</DexContext.Provider>;
