/* eslint-disable import/no-extraneous-dependencies, import/extensions, no-await-in-loop, no-console, no-plusplus */
import { Team } from '@pkmn/sets';
import { Pokepaste, Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import fs from 'fs/promises';
import path from 'path';

import { movesUsage4x, trimUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const prisma = new PrismaClient();

type Row = {
  'Done By': string;
  'Full Name': string;
  'Team Title Presentable': string;
  'Input Tweet': string;
  'Secondary Link': string;
  'Other Links': string;
  'Team Title': string;
  Pokepaste: string;
  'EV? (For Bot)': string;
  'O/R': string;
  '(For Sheet)': string;
  'Rental?': string;
  'Rental Code (Manual Entry)': string;
  'Image Link': string;
  'Date Shared': string;
  'Event or Source': string;
  Position: string;
  'Notes 1': string;
  'Notes 2': string;
  'Notes 3': string;
  'Internal Team ID': string;
};

// Google Sheets stuff
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const vgcpastesSpreadsheetId = '1r6kYCyhnWbBbLfJrYEwB23sPayo2p9lFKil_ZKHlrYA';

const format2gid = {
  gen9vgc2023series2: '1081470482',
};

// GitHub Gists that store the usage data
const format2gistid = {
  gen9vgc2023series1: '9e3311a3253e0fb46fcc2459bab6c65d',
  gen9vgc2023series2: '67ca12acee3728da83c8ce6419e2d1b2',
};

/**
 * Saves the credentials from the environment variables to a file if not already saved.
 */
async function saveCredentials(): Promise<void> {
  // Load client secrets from an environment variable which is a JSON string
  if (!process.env.GOOGLE_CREDENTIALS) {
    throw new Error('Missing GOOGLE_CREDENTIALS environment variable');
  }
  // replace newlines with escaped newlines
  const c = process.env.GOOGLE_CREDENTIALS.replace(/\n/g, '\\n');
  // Save the credentials to a file if not already saved
  await fs.access(CREDENTIALS_PATH).catch(async () => {
    await fs.writeFile(CREDENTIALS_PATH, c);
  });
}

/**
 * Extracts the data from a Google Sheet using the Google Sheets API.
 * @param format - The format name
 */
async function extractFromGoogleSheet(format: keyof typeof format2gid): Promise<Pokepaste[]> {
  // Get the Google Sheet `gid` by the format name
  const gid = format2gid[format];
  if (!gid) {
    throw new Error(`Unknown format ${format}`);
  }

  // Create Google Sheets API client
  await saveCredentials();
  const auth = new google.auth.GoogleAuth({
    keyFilename: CREDENTIALS_PATH,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Read the sheet from VGCPastes repository
  const sheetData = await sheets.spreadsheets.values
    .batchGetByDataFilter({
      spreadsheetId: vgcpastesSpreadsheetId,
      resource: {
        dataFilters: [
          {
            gridRange: {
              sheetId: gid,
              startRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 22,
            },
          },
        ],
      },
    })
    .then((r: any) => r.data.valueRanges[0].valueRange.values);

  // Parse the sheet data into an array of objects
  const keys: Array<keyof Row> = sheetData.shift();
  if (!keys) {
    throw new Error(`Empty sheet for ${format}`);
  }
  // filter out rows with missing data
  const values = sheetData.filter(
    (row: string[]) =>
      row.length === keys.length && // all columns are present
      !row.some((val) => val.startsWith('No Data')) && // no "No Data" values
      row.at(keys.indexOf('Pokepaste'))?.startsWith('https://pokepast.es/') && // Pokepaste link is valid
      Number.isInteger(+(row.at(keys.indexOf('Internal Team ID')) ?? Number.NaN)) // Internal Team ID is an integer
  );
  const objs = values.map((row: string[]) => row.reduce((acc, val, i) => ({ ...acc, [keys[i]!]: val }), {})) as Row[];

  // Create a data array
  return Promise.all(
    objs.map(async (obj) => {
      // add Date with an additional "Team ID" as milliseconds
      const parsedDate = Date.parse(obj['Date Shared']);
      const now = new Date();
      const createdAt = Number.isNaN(parsedDate) ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) : new Date(parsedDate);
      createdAt.setMilliseconds(+obj['Internal Team ID']);
      // add Rental Code
      const rentalCode = obj['Rental Code (Manual Entry)'].length === 6 ? obj['Rental Code (Manual Entry)'] : null;
      // build notes
      const notes = `${[obj['Secondary Link'], obj['Notes 1'], obj['Notes 2'], obj['Notes 3']].filter((n) => n.length > 2).join(' ; ')} Exported by @${
        obj['Done By']
      }`;
      // find source
      const source = (obj['Input Tweet'] || '').startsWith('http')
        ? obj['Input Tweet']
        : obj['Secondary Link'].startsWith('http')
        ? obj['Secondary Link']
        : obj['Other Links'].startsWith('http')
        ? obj['Other Links']
        : null;
      const paste = await fetch(`${obj.Pokepaste}/json`)
        .then((r) => r.json())
        .then((j) => j.paste as string);
      const jsonPaste = JSON.parse(Team.import(paste)?.toJSON() ?? '') as Prisma.JsonArray;
      return {
        id: cuid(),
        author: obj['Full Name'],
        title: obj['Team Title Presentable'],
        paste,
        notes,
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

/**
 * Update the database with the new pastes
 * @param data - The new pastes to add
 * @param format - The format of the pastes
 * @returns boolean - Whether there were any new pastes added
 */
async function updatePGDatabase(data: Pokepaste[], format: keyof typeof format2gid): Promise<boolean> {
  // Upsert by CreatedAt
  const oldData = await prisma.pokepaste.findMany({
    where: {
      format,
      isOfficial: true,
    },
  });
  const newData = data.filter((d) => !oldData.some((o) => o.createdAt.getTime() === d.createdAt.getTime()));
  if (!newData.length) {
    console.log(`No new data for ${format}`);
    return false;
  }
  console.log(`Updating ${newData.length} pastes for ${format}. Titles: \n  ${newData.map((d) => d.title).join('\n  ')}`);
  const result = await prisma.pokepaste.createMany({
    data: newData as Prisma.PokepasteCreateManyInput[],
  });
  console.log(`Created ${result.count} pastes for ${format}`);
  return true;
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
    .map((usage, rank) => trimUsage(usage, rank)) // rank is 0-indexed
    .map(movesUsage4x); // 4x the percentage of each move usage

  // Delete unused properties
  trimmed.forEach((usage) => {
    // @ts-ignore
    delete usage['Viability Ceiling'];
    // @ts-ignore
    delete usage['Checks and Counters'];
  });

  // Save JSON
  const json = JSON.stringify(trimmed, null, 2);
  await fs.writeFile(`./src/posts/usages/vgc/${format}.json`, json);

  // Update gist
  await fetch(`https://api.github.com/gists/${format2gistid[format]}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.GIST_TOKEN}`,
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
    const isChanged = await updatePGDatabase(data, format);
    if (isChanged) {
      console.log(`Calculating usage for ${format}...`);
      await calcUsage(format);
    }
  }

  console.log('Done');
  await prisma.$disconnect().then(() => console.log('Disconnected from database'));
}

(async () => {
  await main();
})();
