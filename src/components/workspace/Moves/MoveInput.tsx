import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';

function MoveInput({ moveIdx }: { moveIdx: number }) {
  const thisFocusedFieldState: FocusedFieldToIdx = { Moves: moveIdx };
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [move, setMove] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    const pm = teamState.getPokemonInTeam(tabIdx);
    if (!pm) return;
    setMove(pm.moves[moveIdx] || '');
  }, [teamState.getPokemonInTeam(tabIdx)?.moves[moveIdx]]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMove = e.target.value;
    setGlobalFilter(newMove); // set search words to filter table
    teamState.updatePokemonOneMoveInTeam(tabIdx, moveIdx, newMove);
  };

  const handleFocus = () => {
    setGlobalFilter(''); // clear search words on table
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
