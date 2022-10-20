import { Prisma, PrismaClient } from '@prisma/client';

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

// Queries
// List all PokePastes
export const listPastesSelect: Prisma.PokepasteSelect = {
  id: true,
  author: true,
  title: true,
  paste: true,
  createdAt: true,
};

export const listPastes = async (format?: string, isOfficial?: boolean, isPublic?: boolean, idsOnly: boolean = false) =>
  prisma.pokepaste.findMany({
    select: idsOnly ? { id: true } : listPastesSelect,
    where: {
      format,
      isPublic: isOfficial ? true : isPublic,
      isOfficial,
    },
    orderBy: {
      id: 'asc',
    },
  });

export type PastesList = ThenArg<ReturnType<typeof listPastes>>;
export type PastesListItem = PastesList[0];

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
