import { Tournament } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { UsageLayout } from '@/components/usages/UsageLayout';
import { Main } from '@/templates/Main';
import { getTournament } from '@/utils/Prisma';
import { Usage } from '@/utils/Types';

const TournamentUsagePage = ({ tournament }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(['common']);
  const usages = JSON.parse(tournament.usages) as Usage[];
  return (
    <Main title={tournament.name + t('common.usage')} description={tournament.name + t('common.usage')}>
      <UsageLayout usages={usages} title={tournament.name} format={tournament.format} formatOptions={[]} />
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<{
  tournament: Tournament;
}> = async (context) => {
  const tournamentId = +(context.params?.id ?? 0);
  const tournament = await getTournament(tournamentId, { usages: true });
  // const tournamentTeams = await getTournamentTeams(tournamentId);
  // const pastes = tournamentTeams.map((tournamentTeam) => tournamentTeam.paste);
  // const species2usage = new Map<string, Usage>();
  // let totalCount = 0;
  // pastes.forEach((paste) => {
  //   Team.import(paste)?.team.forEach((set, _, team) => {
  //     totalCount += 1;
  //     const { species, ability, item, moves, teraType } = set;
  //     if (species && ability && item && moves && teraType) {
  //       const usage: Usage = species2usage.get(species) ?? {
  //         Abilities: {},
  //         Items: {},
  //         Moves: {},
  //         Spreads: {},
  //         Teammates: {},
  //         TeraTypes: {},
  //         name: species,
  //         rank: 0,
  //         'Raw count': 0,
  //         'Viability Ceiling': [0, 0, 0, 0], // not used
  //         'Checks and Counters': {}, // not used
  //         usage: 0,
  //       };
  //
  //       // Count
  //       usage['Raw count'] += 1;
  //       // Abilities
  //       usage.Abilities[ability] = (usage.Abilities[ability] ?? 0) + 1;
  //       // Items
  //       usage.Items[item] = (usage.Items[item] ?? 0) + 1;
  //       // Moves
  //       if (moves[0]) usage.Moves[moves[0]] = (usage.Moves[moves[0]] ?? 0) + 1;
  //       if (moves[1]) usage.Moves[moves[1]] = (usage.Moves[moves[1]] ?? 0) + 1;
  //       if (moves[2]) usage.Moves[moves[2]] = (usage.Moves[moves[2]] ?? 0) + 1;
  //       if (moves[3]) usage.Moves[moves[3]] = (usage.Moves[moves[3]] ?? 0) + 1;
  //       // Teammates
  //       team.forEach((s) => {
  //         if (s.species && s.species !== species) {
  //           usage.Teammates[s.species] = (usage.Teammates[s.species] ?? 0) + 1;
  //         }
  //       });
  //       // Tera Types
  //       if (!usage.TeraTypes) {
  //         usage.TeraTypes = {};
  //       }
  //       if (teraType) {
  //         usage.TeraTypes[teraType] = (usage.TeraTypes[teraType] ?? 0) + 1;
  //       }
  //
  //       // Save back to the map
  //       species2usage.set(species, usage);
  //     }
  //   });
  // });
  // // Convert all the counts to percentages
  // species2usage.forEach((usage) => {
  //   usage.usage = usage['Raw count'] / totalCount;
  //   const abilityCount = Object.values(usage.Abilities).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Abilities).forEach((key) => {
  //     usage.Abilities[key]! /= abilityCount;
  //   });
  //
  //   const itemCount = Object.values(usage.Items).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Items).forEach((key) => {
  //     usage.Items[key]! /= itemCount;
  //   });
  //
  //   const moveCount = Object.values(usage.Moves).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Moves).forEach((key) => {
  //     usage.Moves[key]! /= moveCount;
  //   });
  //
  //   const teammateCount = Object.values(usage.Teammates).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Teammates).forEach((key) => {
  //     usage.Teammates[key]! /= teammateCount;
  //   });
  //
  //   const teraTypeCount = Object.values(usage.TeraTypes!).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.TeraTypes!).forEach((key) => {
  //     usage.TeraTypes![key]! /= teraTypeCount;
  //   });
  // });
  //
  // // Convert all the counts to percentages
  // species2usage.forEach((usage) => {
  //   usage.usage = usage['Raw count'] / totalCount;
  //   const abilityCount = Object.values(usage.Abilities).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Abilities).forEach((key) => {
  //     usage.Abilities[key]! /= abilityCount;
  //   });
  //
  //   const itemCount = Object.values(usage.Items).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Items).forEach((key) => {
  //     usage.Items[key]! /= itemCount;
  //   });
  //
  //   const moveCount = Object.values(usage.Moves).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Moves).forEach((key) => {
  //     usage.Moves[key]! /= moveCount;
  //   });
  //
  //   const teammateCount = Object.values(usage.Teammates).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.Teammates).forEach((key) => {
  //     usage.Teammates[key]! /= teammateCount;
  //   });
  //
  //   const teraTypeCount = Object.values(usage.TeraTypes!).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  //   Object.keys(usage.TeraTypes!).forEach((key) => {
  //     usage.TeraTypes![key]! /= teraTypeCount;
  //   });
  // });
  //
  // // Sort the attributes of each usage object
  // species2usage.forEach((usage) => {
  //   usage.Abilities = Object.fromEntries(Object.entries(usage.Abilities).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
  //   usage.Items = Object.fromEntries(Object.entries(usage.Items).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
  //   usage.Moves = Object.fromEntries(Object.entries(usage.Moves).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
  //   usage.Teammates = Object.fromEntries(Object.entries(usage.Teammates).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
  //   usage.TeraTypes = Object.fromEntries(Object.entries(usage.TeraTypes!).sort(([, a], [, b]) => b - a));
  // });
  //
  // // Sort the usage map by the number of occurrences, then trim it
  // const trimmed = Array.from(species2usage.values())
  //   .sort((a, b) => b['Raw count'] - a['Raw count'])
  //   .map((usage, rank) => trimUsage(usage, rank)) // rank is 0-indexed
  //   .map(movesUsage4x); // 4x the percentage of each move usage
  //
  // // Delete unused properties
  // trimmed.forEach((usage) => {
  //   // @ts-ignore
  //   delete usage['Viability Ceiling'];
  //   // @ts-ignore
  //   delete usage['Checks and Counters'];
  // });
  //
  // // Save JSON
  // const json = JSON.stringify(trimmed, null, 2);
  // await fs.writeFile(`./${tournamentId}.json`, json);

  return {
    props: {
      tournament: JSON.parse(JSON.stringify(tournament)),
      ...(await serverSideTranslations(context.locale ?? 'en', ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'types'])),
    },
  };
};

export default TournamentUsagePage;
