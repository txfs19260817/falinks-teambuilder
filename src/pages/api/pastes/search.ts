import { PokemonSet, StatID } from '@pkmn/types';
import type { NextApiRequest, NextApiResponse } from 'next';

import { listPastesSelect, PastesList, prisma } from '@/utils/Prisma';
import type { SearchPasteForm } from '@/utils/Types';

const handler = async (req: NextApiRequest, res: NextApiResponse<PastesList>) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  // get the data from the request body and validate it
  if (!req.body) {
    return res.status(400);
  }
  const { format, hasRentalCode, speciesCriterion, officialOnly } = req.body as SearchPasteForm;

  // search for pastes using jsonPaste JSONB field
  const results = await prisma.pokepaste
    .findMany({
      select: listPastesSelect,
      where: {
        format: format.length > 0 ? format : undefined,
        rentalCode: hasRentalCode ? { not: null } : undefined,
        isPublic: true,
        isOfficial: officialOnly ? true : undefined,
        jsonPaste: {
          path: [],
          array_contains: speciesCriterion.map(({ species, ability, item, teraType }) => ({
            species,
            ability: ability || undefined,
            item: item || undefined,
            teraType: teraType || undefined,
          })),
        },
      },
    })
    .then((pastes) =>
      // filter out pastes that don't match the criteria
      pastes
        .filter(({ jsonPaste }) =>
          // every one should have evs
          (jsonPaste as unknown as PokemonSet[]).every((p) => p.evs != null),
        )
        .filter(({ jsonPaste }) =>
          speciesCriterion.every((s) =>
            // OR target
            (jsonPaste as unknown as PokemonSet[]).some(
              (t) =>
                s.species === t.species &&
                s.moves.filter((m) => m.length > 0).every((m) => t.moves.includes(m)) && // s.moves is (an array of empty string or a subset of t.moves) is ok
                Object.entries(t.evs).every(([k, v]) => +s.minEVs[k as StatID] <= v && v <= +s.maxEVs[k as StatID]),
            ),
          ),
        ),
    );

  // return the results, rewrite the jsonPaste field to be a list of species
  return res.status(200).json(
    results.map(({ id, title, author, format: resFormat, createdAt, rentalCode, jsonPaste }) => ({
      id: id!,
      title: title!,
      author: author!,
      format: resFormat!,
      createdAt: createdAt!,
      rentalCode: rentalCode == null ? '' : rentalCode,
      hasEVs: Array.isArray(jsonPaste) && Object.hasOwn(typeof jsonPaste[0] === 'object' ? (jsonPaste[0] as object) : {}, 'evs'),
      species: (jsonPaste as { species: string }[]).map((s) => s.species),
    })),
  );
};

export default handler;
