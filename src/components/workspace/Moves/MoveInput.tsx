import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';

function MoveInput({ moveIdx }: { moveIdx: number }) {
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);
  const [move, setMove] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setMove(teamState.team[tabIdx]?.moves[moveIdx] || '');
  }, [teamState.team[tabIdx]?.moves[moveIdx]]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMove = e.target.value;
    setGlobalFilter(newMove);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(moveIdx, 1, newMove);
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>Move {moveIdx + 1}</span>
      <input
        type="search"
        placeholder="Move"
        className="input-accent input input-xs md:input-md"
        value={move}
        onFocus={() => {
          setGlobalFilter('');
          setFocusedField({ Moves: moveIdx });
        }}
        onChange={handleChange}
      />
    </label>
  );
}

export default MoveInput;
