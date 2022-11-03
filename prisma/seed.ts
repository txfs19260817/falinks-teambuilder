/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { Team } from '@pkmn/sets';
import { Prisma, PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

/**
 * Reads a JSON file and returns the parsed data
 * @param filename
 */
function readSeedJSON(filename: string) {
  const seedJSON = fs.readFileSync(filename);
  const rawArr = JSON.parse(seedJSON.toString(), (key, value) => {
    if (key === 'createdAt') {
      return new Date(value);
    }
    return value;
  }) as Prisma.PokepasteCreateInput[];
  return rawArr.filter((seed) => !seed.paste.includes('🔐') && seed.paste.includes('EVs:'));
}

/**
 * The first seed is a Rotom team.
 */
function theFirstSeed() {
  const firstId = 'cl9d479tc000009mp6hun9xwx';
  return prisma.pokepaste.upsert({
    where: {
      id: firstId,
    },
    create: {
      id: firstId,
      notes: '',
      title: 'Go Team Rotom!',
      author: 'Kleen',
      format: 'gen8ou',
      isOfficial: false,
      isPublic: true,
      paste:
        'Rotom @ Wiki Berry\nAbility: Levitate\n-Hex\n-Volt Switch\n-Will-O-Wisp\n-Signal Beam\n\nRotom-Heat @ Wiki Berry\nAbility: Levitate\n-Overheat\n-Volt Switch\n-Toxic\n-Hidden Power Grass\n\nRotom-Frost @ Icium Z\nAbility: Levitate\n-Blizzard\n-Volt Switch\n-Will-O-Wisp\n-Hidden Power Fighting\n\nRotom-Fan @ Wiki Berry\nAbility: Levitate\n-Air Slash\n-Volt Switch\n-Defog\n-Hidden Power Ice\n\nRotom-Mow @ Wiki Berry\nAbility: Levitate\n-Leaf Storm\n-Volt Switch\n-Toxic\n-Hidden Power Rock\n\nRotom-Wash @ Wiki Berry\nAbility: Levitate\n-Hydro Pump\n-Volt Switch\n-Will-O-Wisp\n-Signal Beam',
    },
    update: {},
  });
}

/**
 * Ensure all rows' jsonPaste is populated
 */
async function ensureJSONPastes() {
  const promises = (
    await prisma.pokepaste.findMany({
      select: {
        id: true,
        paste: true,
      },
      where: {
        jsonPaste: undefined,
      },
    })
  )
    .map(({ id, paste }) => ({
      id,
      jsonPaste: JSON.parse(Team.import(paste)?.toJSON() ?? '') as Prisma.JsonArray,
    }))
    .map(({ id, jsonPaste }) =>
      prisma.pokepaste.update({
        where: {
          id,
        },
        data: {
          jsonPaste,
        },
      })
    );
  while (promises.length) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(promises.splice(0, 10)); // 10 at a time
  }
}

async function main() {
  const filePaths = ['./prisma/seeds/s12.json', './prisma/seeds/s13.json', './prisma/seeds/spikemuth.json'];
  const upsertPromises = filePaths.flatMap((filepath) => {
    const seedData = readSeedJSON(filepath);
    return seedData.map((seed) => {
      return prisma.pokepaste.upsert({
        where: { id: seed.id },
        update: seed,
        create: seed,
      });
    });
  });
  while (upsertPromises.length) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(upsertPromises.splice(0, 10)); // 10 at a time
  }
  await theFirstSeed();
  await ensureJSONPastes();
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
