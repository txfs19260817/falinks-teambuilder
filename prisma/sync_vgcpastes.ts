/* eslint-disable import/no-extraneous-dependencies, import/extensions, no-console */
import { Team } from '@pkmn/sets';
import { Pokepaste, Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

const XLSX = require('xlsx');

const prisma = new PrismaClient();
const format2gid = {
  gen9vgc2023series1: '1793433759',
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
      const source = obj['Link to Source'].startsWith('http') ? obj['Link to Source'] : null;
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
  console.log(`Created ${result.count} pastes`);
}

async function main() {
  const formats = Object.keys(format2gid) as (keyof typeof format2gid)[];
  formats.forEach(async (format) => {
    const data = await extractFromGoogleSheet(format);
    await updatePGDatabase(data, format);
  });
}

main();
