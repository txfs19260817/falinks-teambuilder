import { Generation, GenerationNum, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import { Data } from '@pkmn/dex-types';
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
  gen: new Generations(Dex, (d: Data) => {
    if (!d.exists) return false;
    if ('isNonstandard' in d && d.isNonstandard) return d.isNonstandard === 'Gigantamax';
    if (d.kind === 'Ability' && d.id === 'noability') return false;
    return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
  }).get(AppConfig.defaultGen as GenerationNum),
};

// create context
export const DexContext = createContext<DexContextInterface>(dex);

// Provider in app
export const DexContextProvider = ({ children }: DexContextProviderProps) => <DexContext.Provider value={dex}>{children}</DexContext.Provider>;
