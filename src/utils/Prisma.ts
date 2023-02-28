import { Pokepaste, Prisma, PrismaClient } from '@prisma/client';

import { ThenArg } from '@/utils/Types';

/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : process.env.NODE_ENV === 'test'
        ? [
            {
              emit: 'event',
              level: 'query',
            },
          ]
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

/* Queries */
// List all IDs of pastes
export const listPastesIDs = async (options?: { isOfficial?: boolean; isPublic?: boolean; format?: string }) =>
  prisma.pokepaste.findMany({
    select: { id: true },
    where: {
      isOfficial: options?.isOfficial, // true, false, or all (undefined)
      isPublic: options?.isOfficial ? true : options?.isPublic, // if official, must be public, otherwise true, false, or all (undefined)
      format: options?.format, // any one of formats, or all (undefined)
    },
  });

// List all PokePastes
export type PastesListItem = Pick<Pokepaste, 'id' | 'title' | 'author' | 'format' | 'createdAt'> & { species: string[]; hasEVs: boolean };
export type PastesList = PastesListItem[];
export const listPastesSelect: Prisma.PokepasteSelect = {
  id: true,
  title: true,
  author: true,
  format: true,
  createdAt: true,
  rentalCode: true,
  jsonPaste: true,
};

export const listPastes = async (options?: { format?: string; isOfficial?: boolean; isPublic?: boolean }): Promise<PastesList> =>
  prisma.pokepaste
    .findMany({
      select: listPastesSelect,
      where: {
        format: options?.format, // any one of formats, or all (undefined)
        isOfficial: options?.isOfficial, // true, false, or all (undefined)
        isPublic: options?.isOfficial ? true : options?.isPublic, // if official, must be public, otherwise true, false, or all (undefined)
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((response) =>
      response.map(({ id, title, author, format, createdAt, rentalCode, jsonPaste }) => ({
        id: id!,
        title: title!,
        author: author!,
        format: format!,
        createdAt: createdAt!,
        rentalCode: rentalCode == null ? '' : rentalCode,
        hasEVs: Array.isArray(jsonPaste) && Object.hasOwn(typeof jsonPaste[0] === 'object' ? (jsonPaste[0] as object) : {}, 'evs'),
        species: (jsonPaste as { species: string }[]).map((s) => s.species),
      }))
    );

// Get a PokePaste by ID
export const getPaste = async (id: string) =>
  prisma.pokepaste.findUnique({
    where: {
      id,
    },
  });

export type Paste = ThenArg<ReturnType<typeof getPaste>>;

// Create a PokePaste
export const createPaste = async (paste: Prisma.PokepasteCreateInput) =>
  prisma.pokepaste.create({
    data: paste,
  });

// Replays
export const listReplays = async (options: { format: string; pageSize?: number; page?: number }) =>
  prisma.replay.findMany({
    select: {
      id: true,
      uploadtime: true,
      p1: true,
      p2: true,
      p1team: true,
      p2team: true,
      rating: true,
    },
    skip: options.page && options.pageSize ? options.pageSize * (options.page - 1) : undefined,
    take: options.pageSize || undefined,
    where: {
      format: options.format,
    },
    orderBy: {
      uploadtime: 'desc',
    },
  });

// Tournaments
export const listTournaments = async (options?: { format?: string; pageSize?: number; page?: number; include?: boolean }) =>
  prisma.tournament.findMany({
    skip: options && options.page && options.pageSize ? options.pageSize * (options.page - 1) : undefined,
    take: options?.pageSize,
    where: {
      format: options?.format,
    },
    orderBy: {
      date: 'desc',
    },
    include: {
      teams: options?.include ?? false,
    },
  });

export const getTournament = async (id: number) =>
  prisma.tournament.findUnique({
    where: {
      id,
    },
  });

export const getTournamentTeams = async (tournamentId?: number) =>
  prisma.tournamentTeam.findMany({
    where: {
      tournamentId,
    },
    orderBy: {
      standing: 'asc',
    },
  });
