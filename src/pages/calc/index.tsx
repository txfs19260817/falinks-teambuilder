import { Move } from '@pkmn/data';
import { GetStaticProps } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useId } from 'react';
import useSWR from 'swr';

import { defaultDex, DexContext, DexContextProvider } from '@/components/workspace/Contexts/DexContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { getMovesBySpecie, typesWithEmoji } from '@/utils/PokemonUtils';

const MovesSelector = ({ pokemonName }: { pokemonName: string }) => {
  const { gen } = useContext(DexContext);
  const { data } = useSWR<Move[]>(pokemonName, (k) => getMovesBySpecie(gen, k));
  const datalistID = useId();
  return (
    <ul className="rounded-box m-1 border border-base-300 bg-base-200 p-1 shadow-md">
      <li className="indent-3 capitalize">{pokemonName}</li>
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="rounded-lg border border-neutral/25 bg-base-300 p-0.5">
          {/* Moves */}
          <input list={datalistID + i} className="select-bordered select select-sm w-1/4" placeholder={`Move ${i + 1}`} autoComplete="off" type="search" />
          <datalist id={datalistID + i}>
            {data?.map((move, j) => (
              <option key={j} value={move.name}>
                {move.name}
              </option>
            ))}
          </datalist>
          {/* Power */}
          <input className="input-bordered input input-sm w-1/12" type="number" max={250} min={0} placeholder="Power" />
          {/* Types */}
          <input list={datalistID + (i + 1) * 10} className="select-bordered select select-sm w-1/6 placeholder:font-light" placeholder="Types" type="search" />
          <datalist id={datalistID + (i + 1) * 10}>
            {typesWithEmoji.map(({ type, emoji }, j) => (
              <option key={j} value={type}>
                {emoji} {type}
              </option>
            ))}
          </datalist>
          {/* Category */}
          <input
            list={datalistID + (i + 1) * 100}
            className="select-bordered select select-sm w-1/6 placeholder:font-light"
            placeholder="Category"
            type="search"
          />
          <datalist id={datalistID + +(i + 1) * 100}>
            <option value="Physical">💥 Physical</option>
            <option value="Special">🔮 Special</option>
          </datalist>
          {/* Buff */}
          <input
            list={datalistID + (i + 1) * 1000}
            className="select-bordered select select-sm w-1/6 placeholder:font-light"
            placeholder="Buff"
            type="search"
          />
          <datalist id={datalistID + (i + 1) * 1000}>
            <option value="Crit">Critical Hit</option>
            <option value="Z">Z-Move</option>
          </datalist>
          {/*  Output */}
          <span className="text-sm text-neutral">50.1%-60.0%</span>
        </li>
      ))}
    </ul>
  );
};

const MovesPanel = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MovesSelector pokemonName="bulbasaur" />
      <MovesSelector pokemonName="squirtle" />
    </div>
  );
};

const OutputAlert = () => {
  return (
    <div className="alert m-1 shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 stroke-info">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">New message!</h3>
          <div className="text-xs">You have 1 unread message</div>
        </div>
      </div>
      <div className="flex-none">
        <button className="btn-sm btn">See</button>
      </div>
    </div>
  );
};

const InputsPanel = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div />
      <div />
      <div />
    </div>
  );
};

const Page = () => {
  return (
    <DexContextProvider value={defaultDex}>
      <Main title="Damage Calculator">
        <MovesPanel />
        <OutputAlert />
        <InputsPanel />
      </Main>
    </DexContextProvider>
  );
};

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};
export default Page;
