import { Generation, Generations } from '@pkmn/data';
import { Data, Dex } from '@pkmn/dex';
import { Field, Move, Pokemon } from '@smogon/calc';
import { createContext, ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

interface CalculationsContextInterface {
  gen: Generation;
  pokemonPair: [Pokemon, Pokemon];
  attacker: 1 | 2;
  move: Move;
  field: Field;
}

type CalculationsContextProviderProps = {
  children: ReactNode;
  value: CalculationsContextInterface;
};

const gen = new Generations(Dex, (d: Data) => {
  if (!d.exists) return false;
  if ('isNonstandard' in d && d.isNonstandard) return d.isNonstandard === 'Gigantamax';
  if (d.kind === 'Ability' && d.id === 'noability') return false;
  return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
}).get(AppConfig.defaultGen);

export const defaultCalculations: CalculationsContextInterface = {
  gen,
  pokemonPair: [new Pokemon(gen, 'Abomasnow'), new Pokemon(gen, 'Abomasnow')],
  attacker: 1,
  move: new Move(gen, 'Blizzard'),
  field: new Field(),
};

// create context
export const CalculationsContext = createContext<CalculationsContextInterface>(defaultCalculations);

// Provider in app
export const CalculationsContextProvider = ({ children, value }: CalculationsContextProviderProps) => (
  <CalculationsContext.Provider value={value}>{children}</CalculationsContext.Provider>
);
