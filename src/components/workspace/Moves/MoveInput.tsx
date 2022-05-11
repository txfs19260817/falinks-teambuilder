import { useSyncedStore } from '@syncedstore/react';
import { ChangeEvent, useEffect, useState } from 'react';

import { teamStore } from '@/store';

function MoveInput({ onFocus, moveIdx, tabIdx }: { onFocus: () => void; moveIdx: number; tabIdx: number }) {
  const teamState = useSyncedStore(teamStore);
  const [move, setMove] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setMove(teamState.team[tabIdx]?.moves[moveIdx] || '');
  }, [teamState.team[tabIdx]?.moves[moveIdx]]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMove = e.target.value;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(moveIdx, 1, newMove);
  };

  return (
    <div className="tooltip" data-tip="Please pick a move below">
      <label className="input-group-xs input-group input-group-vertical">
        <span>Move {moveIdx + 1}</span>
        <input
          type="text"
          placeholder="Move"
          className="input-accent input input-xs md:input-md"
          value={move}
          onFocus={onFocus}
          onChange={handleChange}
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />
      </label>
    </div>
  );
}

export default MoveInput;
