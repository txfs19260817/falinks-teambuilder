/* eslint-disable import/no-extraneous-dependencies, import/extensions, no-await-in-loop, no-console, no-plusplus */
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

interface Teamlist {
  'First name': string;
  'Last name': string;
  Country: string;
  Division: string;
  'Trainer name': string;
  'Team List': string;
  Standing: number;
  Team: Team[];
  PokePaste: string;
}

interface Team {
  teraType: string;
  ability: string;
  item: string;
  name: string;
  moves: string[];
}

async function insertTeamlistFromJSON(teamlists: Teamlist[], tournamentId: number) {
  const data = teamlists.map((teamlist) => ({
    author: `${teamlist['First name']} ${teamlist['Last name']}`,
    standing: teamlist.Standing,
    paste: teamlist.PokePaste,
    country: teamlist.Country,
    tournamentId,
  }));
  const result = await prisma.tournamentTeam.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Inserted ${result.count} teams.`);
}

async function main() {
  const regions = [
    // {
    //   id: 1,
    //   name: 'San Diego',
    //   filename: './scripts/sandiego_team_list.json',
    // },
    // {
    //   id: 2,
    //   name: 'Liverpool',
    //   filename: './scripts/liverpool_team_list.json',
    // },
    // {
    //   id: 3,
    //   name: 'Orlando',
    //   filename: './scripts/orlando_team_list.json',
    // },
    // {
    //   id: 4,
    //   name: 'Oceania',
    //   filename: './scripts/ocic_team_list.json',
    // },
    // {
    //   id: 5,
    //   name: 'Bochum',
    //   filename: './scripts/bochum_team_list.json',
    // },
    // {
    //   id: 6,
    //   name: 'Knoxville',
    //   filename: './scripts/knoxville_team_list.json',
    // },
    // {
    //   id: 7,
    //   name: 'Perth',
    //   filename: './scripts/perth_team_list.json',
    // },
    {
      id: 9,
      name: 'Vancouver',
      filename: './scripts/vancouver_team_list.json',
    },
  ];
  await Promise.all(
    regions.map(({ filename, id }) =>
      readFile(filename, 'utf-8')
        .then((s: string) => JSON.parse(s) as Teamlist[])
        .then((t) => insertTeamlistFromJSON(t, id))
    )
  );
  console.log('Done');
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
