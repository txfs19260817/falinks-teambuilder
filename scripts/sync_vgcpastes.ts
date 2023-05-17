/* eslint-disable import/no-extraneous-dependencies, import/extensions, no-await-in-loop, no-console, no-plusplus */
import { Team } from '@pkmn/sets';
import { Pokepaste, Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import fs from 'fs/promises';
import path from 'path';

import { calcUsageFromPastes } from '@/utils/PokemonUtils';

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
  // gen9vgc2023series2: '1081470482',
  gen9vgc2023regulationc: '1919079665',
};

// GitHub Gists that store the usage data
const format2gistid = {
  gen9vgc2023series1: '9e3311a3253e0fb46fcc2459bab6c65d',
  gen9vgc2023series2: '67ca12acee3728da83c8ce6419e2d1b2',
  gen9vgc2023regulationc: 'f952b9a9012cb1b375772a106b40b26f',
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
      Number.isInteger(+(row.at(keys.indexOf('Internal Team ID'))?.slice(1) ?? Number.NaN)) // Internal Team ID is an integer (drop the first character 'C')
  );
  const objs = values.map((row: string[]) => row.reduce((acc, val, i) => ({ ...acc, [keys[i]!]: val }), {})) as Row[];
  // update 'Internal Team ID' to be the integer value
  objs.forEach((obj) => {
    obj['Internal Team ID'] = obj['Internal Team ID'].slice(1);
  });

  // Create a data array
  return Promise.all(
    objs.map(async (obj) => {
      // title and author
      const title = obj['Team Title Presentable'].trim();
      const author = (obj['Full Name'].length > 2 ? obj['Full Name'] : obj['Team Title Presentable'].split("'s ")[0] ?? 'Unknown').trim();
      // add Date with an additional "Team ID" as milliseconds
      const parsedDate = Date.parse(obj['Date Shared']);
      if (Number.isNaN(parsedDate)) {
        throw new Error(`Invalid date ${obj['Date Shared']}, obj: ${JSON.stringify(obj)}`);
      }
      const createdAt = new Date(parsedDate);
      createdAt.setMilliseconds(+obj['Internal Team ID']); // add Internal Team ID as milliseconds onto the timestamp
      // add Rental Code
      const rentalCode = obj['Rental Code (Manual Entry)'].length === 6 ? obj['Rental Code (Manual Entry)'] : null;
      // build notes
      const notes = `${[obj['Secondary Link'], obj['Notes 1'], obj['Notes 2'], obj['Notes 3']].filter((n) => n.length > 2).join(' ; ')} Exported by @${
        obj['Done By'].length > 2 ? obj['Done By'] : 'VGCPastes'
      }`.trim();
      // find source
      const source = (obj['Input Tweet'] || '').startsWith('http')
        ? obj['Input Tweet']
        : obj['Secondary Link'].startsWith('http')
        ? obj['Secondary Link']
        : obj['Other Links'].startsWith('http')
        ? obj['Other Links']
        : null;
      // fetch the paste
      const paste = await fetch(`${obj.Pokepaste}/json`)
        .then((r) => r.json())
        .then((j) => j.paste as string);
      // parse the paste
      const jsonPaste = JSON.parse(Team.import(paste)?.toJSON() ?? '') as Prisma.JsonArray;

      return {
        id: cuid(),
        author,
        title,
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
  // filter out old data from the new data by CreatedAt's milliseconds
  const newData = data.filter((d) => !oldData.some((o) => o.createdAt.getMilliseconds() === d.createdAt.getMilliseconds()));
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

  const usages = calcUsageFromPastes(pastes);
  // Save JSON
  const json = JSON.stringify(usages, null, 2);
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
