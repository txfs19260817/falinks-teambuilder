import { Generation, Move } from '@pkmn/data';
import Image from 'next/image';
import { memo } from 'react';

import { Select } from '@/components/select/Select';
import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import { moveCategoriesWithEmoji, typesWithEmoji } from '@/utils/PokemonUtils';

const MovesSetters = memo(
  ({
    gen,
    learnset,
    moves,
    setMoves,
    crits,
    setCrits,
    basePath,
  }: {
    gen: Generation;
    learnset: Move[];
    moves: [Move, Move, Move, Move];
    setMoves: (m: [Move, Move, Move, Move]) => void;
    crits: [boolean, boolean, boolean, boolean];
    setCrits: (c: [boolean, boolean, boolean, boolean]) => void;
    basePath: string;
  }) => (
    <>
      {/* Move */}
      <div role="gridcell" className="col-span-3 grid grid-cols-1">
        {moves.map((move, i) => (
          <Select
            key={i}
            itemClassName="w-1/2"
            iconGetter={(k) => (
              <Image className="inline-block" width={20} height={20} alt={k} src={`${basePath}/assets/types/${gen.moves.get(k)?.type}.webp`} loading="lazy" />
            )}
            options={learnset.map((l) => ({
              label: l.name,
              value: l.name,
            }))}
            value={{ label: move.name, value: move.name }}
            onChange={(e) => {
              const newMove = gen.moves.get(e.value);
              if (newMove) {
                setMoves(moves.map((m, j) => (j === i ? newMove : m)) as [Move, Move, Move, Move]);
              }
            }}
          />
        ))}
      </div>
      {/*  Power inputs & crit switch */}
      <div role="gridcell" className="grid grid-rows-4">
        {moves.map((move, i) => (
          <div key={i} className="grid grid-cols-1">
            <input
              className="input-bordered input input-xs self-center"
              type="number"
              min="0"
              max="255"
              value={move.basePower}
              onChange={(e) => {
                setMoves(
                  moves.map((m, j) =>
                    j === i
                      ? {
                          ...m,
                          basePower: +e.target.value,
                        }
                      : m
                  ) as [Move, Move, Move, Move]
                );
              }}
            />
            <button
              className={`self-center btn-xs btn ${crits[i] ? '' : 'btn-outline'}`}
              onClick={() => setCrits(crits.map((c, j) => (j === i ? !c : c)) as [boolean, boolean, boolean, boolean])}
            >
              Crit
            </button>
          </div>
        ))}
      </div>
      {/*  Move Type & Category select */}
      <div role="gridcell" className="col-span-2 grid grid-rows-4">
        {moves.map((move, i) => (
          <div key={i} className="grid grid-cols-1">
            <ValueWithEmojiSelector
              options={typesWithEmoji}
              enableEmojis={false}
              className="select-bordered select-xs"
              bindValue={move.type}
              onChange={(e) =>
                setMoves(
                  moves.map((m, j) =>
                    j === i
                      ? {
                          ...m,
                          type: e.target.value,
                        }
                      : m
                  ) as [Move, Move, Move, Move]
                )
              }
            />
            <ValueWithEmojiSelector
              options={moveCategoriesWithEmoji}
              enableEmojis={false}
              className="select-bordered select-xs"
              bindValue={move.category}
              onChange={(e) =>
                setMoves(
                  moves.map((m, j) =>
                    j === i
                      ? {
                          ...m,
                          category: e.target.value,
                        }
                      : m
                  ) as [Move, Move, Move, Move]
                )
              }
            />
          </div>
        ))}
      </div>
    </>
  )
);

MovesSetters.displayName = 'MovesSetters';

export { MovesSetters };
