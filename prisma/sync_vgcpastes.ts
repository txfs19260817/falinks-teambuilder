/* eslint-disable import/no-extraneous-dependencies, import/extensions, no-await-in-loop, no-console, no-plusplus */
import { Team } from '@pkmn/sets';
import { Pokepaste, Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import * as fs from 'fs';

import { trimUsage } from '@/utils/PokemonUtils';
import { Usage } from '@/utils/Types';

const XLSX = require('xlsx');

const prisma = new PrismaClient();
const format2gid = {
  gen9vgc2023series1: '1793433759',
};
const format2gistid = {
  gen9vgc2023series1: '9e3311a3253e0fb46fcc2459bab6c65d',
};

interface Row {
  'Team ID': number;
  'Team Description': string;
  Pokepaste: string;
  EVs: string;
  'Extracted paste?': string;
  'Rental Status': string;
  'Rental Code\n(Click text for image)': string;
  'Date Shared': number;
  'Tournament / Event': string;
  Rank: string;
  'Link to Source': string;
  'Report / Video': string;
  'Other Links': string;
  Owner: string;
  'Pokemon Text for Copypasta': string;
  'Twitter ID': number;
}

async function extractFromGoogleSheet(format: keyof typeof format2gid): Promise<Pokepaste[]> {
  // Get the Google Sheet `gid` by the format name
  const gid = format2gid[format];
  if (!gid) {
    throw new Error(`Unknown format ${format}`);
  }

  // Read sheet from VGCPastes repository
  const url = `https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw/export?format=xlsx&gid=${gid}`;
  const data = await (await fetch(url)).arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log(`Read Sheet from ${url}`);

  // Get the rows
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(2);
  const keys: string[] = rows.shift()!.map((v: any, i: number) => (typeof v === 'string' ? v : `Column ${i}`));

  // Create an object array with the first row as the key and the following rows as the value
  const objs: Row[] = rows
    .map((row: any[]) =>
      row.reduce((obj, value, index) => {
        obj[keys[index]!] = value;
        return obj;
      }, {} as Row)
    )
    .filter((obj: Row) => obj.EVs === 'Yes' && (obj.Pokepaste || '').startsWith('http'));

  // Create a data array
  return Promise.all(
    objs.map(async (obj) => {
      // add Date with an additional "Team ID" as milliseconds
      const createdAt = new Date(Date.UTC(0, 0, obj['Date Shared'] - 1));
      createdAt.setMilliseconds(obj['Team ID']);
      const rentalCode = obj['Rental Code\n(Click text for image)'].length === 6 ? obj['Rental Code\n(Click text for image)'] : null;
      const notes = `Exported by @VGCPastes${obj['Report / Video'] === '-' ? '' : `\n${obj['Report / Video']}`}`;
      const source = (obj['Link to Source'] || '').startsWith('http') ? obj['Link to Source'] : null;
      const paste = await fetch(`${obj.Pokepaste}/json`)
        .then((res) => res.json())
        .then((json) => json.paste as string);
      const jsonPaste = JSON.parse(Team.import(paste)?.toJSON() ?? '') as Prisma.JsonArray;
      return {
        id: cuid(),
        title: obj['Team Description'],
        author: obj.Owner,
        notes,
        paste,
        source,
        format,
        isPublic: true,
        isOfficial: true,
        createdAt,
        rentalCode,
        jsonPaste,
      };
    })
  );
}

async function updatePGDatabase(data: Pokepaste[], format: keyof typeof format2gid): Promise<void> {
  // Select all the pastes from the database
  const oldData = await prisma.pokepaste.findMany({
    where: {
      format,
      isOfficial: true,
    },
  });
  const newData = data.filter((d) => !oldData.some((o) => o.paste === d.paste && o.author === d.author));
  if (!newData.length) {
    console.log(`No new data for ${format}`);
    return;
  }
  console.log(`Updating ${newData.length} pastes for ${format}. Titles: \n  ${newData.map((d) => d.title).join('\n  ')}`);
  const result = await prisma.pokepaste.createMany({
    data: newData as Prisma.PokepasteCreateManyInput[],
  });
  console.log(`Created ${result.count} pastes for ${format}`);
}

async function calcUsage(format: keyof typeof format2gid) {
  // Fetch all the pastes from the database
  const pastes = await prisma.pokepaste
    .findMany({
      select: {
        paste: true,
      },
      where: {
        format,
        isOfficial: true,
      },
    })
    .then((d) => d.map(({ paste }) => paste));
  // Build the usage map, counting the occurrences of each Pokémon and their attributes
  const species2usage = new Map<string, Usage>();
  let totalCount = 0;
  pastes.forEach((paste) => {
    Team.import(paste)?.team.forEach((set, _, team) => {
      totalCount++;
      const { species, ability, item, moves, nature, evs, teraType } = set;
      if (species && ability && item && moves) {
        const usage: Usage = species2usage.get(species) ?? {
          Abilities: {},
          Items: {},
          Moves: {},
          Spreads: {},
          Teammates: {},
          TeraTypes: {},
          name: species,
          rank: 0,
          'Raw count': 0,
          'Viability Ceiling': [0, 0, 0, 0], // not used
          'Checks and Counters': {}, // not used
          usage: 0,
        };

        // Count
        usage['Raw count']++;
        // Abilities
        usage.Abilities[ability] = (usage.Abilities[ability] ?? 0) + 1;
        // Items
        usage.Items[item] = (usage.Items[item] ?? 0) + 1;
        // Moves
        if (moves[0]) usage.Moves[moves[0]] = (usage.Moves[moves[0]] ?? 0) + 1;
        if (moves[1]) usage.Moves[moves[1]] = (usage.Moves[moves[1]] ?? 0) + 1;
        if (moves[2]) usage.Moves[moves[2]] = (usage.Moves[moves[2]] ?? 0) + 1;
        if (moves[3]) usage.Moves[moves[3]] = (usage.Moves[moves[3]] ?? 0) + 1;
        // Spreads
        if (nature && evs) {
          const spread = `${nature}:${evs.hp}/${evs.atk}/${evs.def}/${evs.spa}/${evs.spd}/${evs.spe}`;
          usage.Spreads[spread] = (usage.Spreads[spread] ?? 0) + 1;
        }
        // Teammates
        team.forEach((s) => {
          if (s.species && s.species !== species) {
            usage.Teammates[s.species] = (usage.Teammates[s.species] ?? 0) + 1;
          }
        });
        // Tera Types
        if (!usage.TeraTypes) {
          usage.TeraTypes = {};
        }
        if (teraType) {
          usage.TeraTypes[teraType] = (usage.TeraTypes[teraType] ?? 0) + 1;
        }

        // Save back to the map
        species2usage.set(species, usage);
      }
    });
  });

  // Convert all the counts to percentages
  species2usage.forEach((usage) => {
    usage.usage = usage['Raw count'] / totalCount;
    const abilityCount = Object.values(usage.Abilities).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Abilities).forEach((key) => {
      usage.Abilities[key]! /= abilityCount;
    });

    const itemCount = Object.values(usage.Items).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Items).forEach((key) => {
      usage.Items[key]! /= itemCount;
    });

    const moveCount = Object.values(usage.Moves).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Moves).forEach((key) => {
      usage.Moves[key]! /= moveCount;
    });

    const spreadCount = Object.values(usage.Spreads).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Spreads).forEach((key) => {
      usage.Spreads[key]! /= spreadCount;
    });

    const teammateCount = Object.values(usage.Teammates).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Teammates).forEach((key) => {
      usage.Teammates[key]! /= teammateCount;
    });

    const teraTypeCount = Object.values(usage.TeraTypes!).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.TeraTypes!).forEach((key) => {
      usage.TeraTypes![key]! /= teraTypeCount;
    });
  });

  // Sort the attributes of each usage object
  species2usage.forEach((usage) => {
    usage.Abilities = Object.fromEntries(Object.entries(usage.Abilities).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Items = Object.fromEntries(Object.entries(usage.Items).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Moves = Object.fromEntries(Object.entries(usage.Moves).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Spreads = Object.fromEntries(Object.entries(usage.Spreads).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Teammates = Object.fromEntries(Object.entries(usage.Teammates).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.TeraTypes = Object.fromEntries(Object.entries(usage.TeraTypes!).sort(([, a], [, b]) => b - a));
  });

  // Sort the usage map by the number of occurrences, then trim it
  const trimmed = Array.from(species2usage.values())
    .sort((a, b) => b['Raw count'] - a['Raw count'])
    .map((usage, rank) => trimUsage(usage, rank)); // rank is 0-indexed

  // Delete unused properties
  trimmed.forEach((usage) => {
    // @ts-ignore
    delete usage['Viability Ceiling'];
    // @ts-ignore
    delete usage['Checks and Counters'];
  });

  // Save JSON
  const json = JSON.stringify(trimmed, null, 2);
  fs.writeFileSync(`./src/posts/usages/vgc/${format}.json`, json);

  // Update gist
  const authorizationHeader = `Bearer ${process.env.GIST_TOKEN}`;
  await fetch(`https://api.github.com/gists/${format2gistid[format]}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorizationHeader,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      public: true,
      description: `VGCPastes ${format} usage data`,
      files: {
        [`${format}.json`]: {
          content: json,
        },
      },
    }),
  }).then((r) => console.log('Gist updated: ', r.status));
}

async function main() {
  const formats = Object.keys(format2gid) as (keyof typeof format2gid)[];
  // eslint-disable-next-line no-restricted-syntax
  for (const format of formats) {
    const data = await extractFromGoogleSheet(format);
    console.log(`Extracted ${data.length} pastes for ${format}, saving to database...`);
    await updatePGDatabase(data, format);
    console.log(`Calculating usage for ${format}...`);
    await calcUsage(format);
  }

  console.log('Done');
  await prisma.$disconnect().then(() => console.log('Disconnected from database'));
}

(async () => {
  await main();
})();
