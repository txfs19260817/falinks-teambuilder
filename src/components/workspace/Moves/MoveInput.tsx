import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';

function MoveInput({ moveIdx }: { moveIdx: number }) {
  const thisFocusedFieldState: FocusedFieldToIdx = { Moves: moveIdx };
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
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

  const handleFocus = () => {
    setGlobalFilter('');
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>Move {moveIdx + 1}</span>
      <input
        type="search"
        placeholder="Move"
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={move}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default MoveInput;
