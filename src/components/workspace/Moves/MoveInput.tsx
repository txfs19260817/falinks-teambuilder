import { ChangeEvent, useEffect, useState } from 'react';

import { PanelProps } from '@/components/workspace/types';

function MoveInput({ onFocus, moveIdx, teamState, tabIdx }: { onFocus: () => void; moveIdx: number } & PanelProps) {
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
