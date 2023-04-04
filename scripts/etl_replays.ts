/* eslint-disable import/no-extraneous-dependencies, no-restricted-syntax, no-await-in-loop, no-console, no-plusplus */
import { Generations } from '@pkmn/data';
import { Data, Dex } from '@pkmn/dex';
import { PokemonDetails, PokemonIdent, Protocol } from '@pkmn/protocol';
import { PrismaClient, replay } from '@prisma/client';

import type { ReplayResponse } from '../src/utils/Types';

const LAST_N_HOURS = 3;
const GENERATION = 9;
const RATING = 1500;
const FORMATS = ['gen9vgc2023regulationc'];

const prisma = new PrismaClient();
const gen = new Generations(Dex, (d: Data) => {
  if (!d.exists) return false;
  if ('isNonstandard' in d && d.isNonstandard) return false;
  if (d.kind === 'Ability' && d.id === 'noability') return false;
  return !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
}).get(GENERATION);
const replaySearchEndpoint = (format: string, page: number): string => `https://replay.pokemonshowdown.com/search.json?format=${format}&page=${page}`;

function getLastNHoursRange(n: number): [number, number] {
  const now = new Date();
  const start = new Date(now);
  start.setHours(now.getHours() - n);
  return [start.getTime() / 1000, now.getTime() / 1000];
}

async function getReplays(format: string, options?: { timeRange?: [number, number]; minRating?: number }): Promise<replay[]> {
  // Fetch all raw replays from the `replay.pokemonshowdown.com` API with given conditions
  const fetchedReplays: ReplayResponse[] = [];
  for (let page = 1; ; page++) {
    console.log(`Fetching raw replays for ${format}... (page ${page})`);
    const searchRes = (await fetch(replaySearchEndpoint(format, page)).then((r) => r.json())) as Awaited<
      Pick<ReplayResponse, 'id' | 'uploadtime' | 'format'>[]
    >;
    const replayPromises = searchRes
      .filter((r) => (options?.timeRange ? r.uploadtime >= options.timeRange[0] && r.uploadtime <= options.timeRange[1] : true))
      .map(({ id }) => fetch(`https://replay.pokemonshowdown.com/${id}.json`).then((r) => r.json() as Promise<ReplayResponse>));
    const replayResponses = await Promise.all(replayPromises);
    fetchedReplays.push(...replayResponses.filter((r) => (options?.minRating ? r.rating >= options.minRating : true)));

    // exit if we've reached the oldest replay within the time range
    const lastReplayTs = searchRes.at(-1)?.uploadtime ?? 0;
    if (lastReplayTs <= (options?.timeRange ? options.timeRange[0] : lastReplayTs)) break;
  }

  // Extract teams of each player from the raw replays to build `replay` objects
  console.log(`Extracting teams from ${fetchedReplays.length} replays...`);
  return fetchedReplays.map((response) => {
    const p1team: string[] = [];
    const p2team: string[] = [];
    const teamPreviews = response.log
      .split('\n')
      .filter((s) => s.startsWith('|poke|'))
      .map((s) => s.split('|').slice(2));
    for (const [player, details] of teamPreviews) {
      const { speciesForme } = Protocol.parseDetails('', '' as PokemonIdent, details as PokemonDetails | undefined);
      const speciesId = gen.species.get(speciesForme)?.id ?? '';
      if (player === 'p1') {
        p1team.push(speciesId);
      } else {
        p2team.push(speciesId);
      }
    }
    return {
      id: response.id,
      format: response.format,
      rating: response.rating,
      log: response.log,
      p1: response.p1,
      p2: response.p2,
      p1team: p1team.sort(),
      p2team: p2team.sort(),
      uploadtime: new Date(response.uploadtime * 1000),
    };
  });
}

async function main() {
  for (const format of FORMATS) {
    const replays = await getReplays(format, {
      minRating: RATING,
      timeRange: getLastNHoursRange(LAST_N_HOURS),
    });
    console.log(`Inserting ${replays.length} replays into the database...`);
    await prisma.replay.createMany({
      data: replays,
      skipDuplicates: true,
    });
  }
}

(async () => {
  await main();
})();
