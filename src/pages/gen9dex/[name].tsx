import { StatsTable } from '@pkmn/types';
import fs from 'fs';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { join } from 'path';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import DexSingleton from '@/models/DexSingleton';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { wikiLink } from '@/utils/PokemonUtils';

type Gen9Dex = {
  id: number;
  num: number; // regional dex number
  name: string;
  stats: StatsTable;
  type: string[];
  abilities: string[];
  moves: string[];
  egg_groups: string[];
};

type Gen9GeneralData = {
  name: string;
  desc: string;
};

function InfoCard({ pokemon, abilities }: { pokemon: Gen9Dex; abilities: Gen9GeneralData[] }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Avatar */}
      <PureSpriteAvatar species={pokemon.name} />
      <div className="card-body">
        {/* Name */}
        <div className="card-title">
          <h2>{pokemon.name}</h2>
        </div>
        {/* Content */}
        <div role="list" className="grid lg:grid-cols-2">
          <div role="listitem">
            <h3 className="font-bold">Types : </h3>
            <div className="flex flex-row gap-2">
              {pokemon.type.map((typeName) => (
                <RoundTypeIcon key={typeName} typeName={typeName} />
              ))}
            </div>
          </div>
          <div role="listitem">
            <h3 className="font-bold">Abilities : </h3>
            <div className="flex flex-col gap-2">
              {abilities.map(({ name, desc }) => (
                <div key={name} className="flex">
                  <a href={wikiLink(name)} className="font-bold flex-none">
                    {name}:
                  </a>
                  <p className="px-2">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div role="listitem">
            {/* Abilities list */}
            <h3 className="font-bold">Base : </h3>
            {Object.entries(pokemon.stats).map(([key, value]) => (
              <div role="progressbar" key={key} className="flex flex-wrap items-center justify-between px-1 text-sm">
                <label className="w-10 flex-none uppercase">{key}: </label>
                <meter className="w-full flex-1" min={0} max={256} low={80} high={100} optimum={130} value={value} title={`${value}`} />
                <label className="w-10">{value}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralDataTable({ tableTitle, data, iconGetter }: { tableTitle: string; data: Gen9GeneralData[]; iconGetter: (key: string) => JSX.Element }) {
  return (
    <table className="table-zebra table-compact table w-full">
      <thead>
        <tr>
          <th className="w-1/12">#</th>
          <th>{tableTitle}</th>
          <th className="w-1/12">Description</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, desc }, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {iconGetter ? iconGetter(name) : null}
                <a href={wikiLink(name)} target="_blank" rel="noreferrer" title="Open in wiki">
                  {name}
                </a>
              </td>
              <td>{desc}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const NamePage = ({ pokemon, abilities, moves }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Main title={`${pokemon.name} - Gen 9 Dex`}>
      <InfoCard pokemon={pokemon} abilities={abilities} />
      <div className="flex flex-col gap-2 overflow-x-auto p-2">
        <GeneralDataTable tableTitle="Moves" data={moves} iconGetter={(k) => <RoundTypeIcon typeName={DexSingleton.getGen().moves.get(k)?.type ?? '???'} />} />
      </div>
    </Main>
  );
};

export const getStaticProps: GetStaticProps<
  {
    pokemon: Gen9Dex;
    abilities: Gen9GeneralData[];
    moves: Gen9GeneralData[];
  } & SSRConfig,
  { name: string }
> = async ({ params, locale }) => {
  // get the pokemon data
  const dexContents = fs.readFileSync(join(process.cwd(), 'public/assets/gen9dex/pokemon.json'), 'utf8');
  const dex = JSON.parse(dexContents) as Gen9Dex[];
  const pokemon = dex.find((p) => p.name === params?.name)!;

  // get the ability data
  const abilityContents = fs.readFileSync(join(process.cwd(), 'public/assets/gen9dex/ability.json'), 'utf8');
  const abilitiesAll = JSON.parse(abilityContents) as Gen9GeneralData[];
  const abilities = abilitiesAll.filter((a) => pokemon.abilities.includes(a.name));

  // get the move data
  const moveContents = fs.readFileSync(join(process.cwd(), 'public/assets/gen9dex/move.json'), 'utf8');
  const movesAll = JSON.parse(moveContents) as Gen9GeneralData[];
  const moves = movesAll.filter((m) => pokemon.moves.includes(m.name));

  return {
    props: {
      pokemon,
      abilities,
      moves,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const dexContents = fs.readFileSync(join(process.cwd(), 'public/assets/gen9dex/pokemon.json'), 'utf8');
  const dex = JSON.parse(dexContents) as Gen9Dex[];
  const paths =
    context.locales?.flatMap((locale) =>
      dex.map(({ name }) => ({
        params: { name },
        locale,
      }))
    ) ?? dex.map(({ name }) => ({ params: { name } }));

  return {
    paths,
    fallback: false,
  };
};

export default NamePage;
