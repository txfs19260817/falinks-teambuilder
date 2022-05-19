import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

function GMaxSwitch() {
  const { teamState, tabIdx } = useContext(StoreContext);
  // get dex
  const { gen } = useContext(DexContext);

  const [checked, setChecked] = useState(false);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setChecked(teamState.team[tabIdx]?.gigantamax || false);
  }, [teamState.team[tabIdx]?.gigantamax]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].gigantamax = newChecked;
  };

  const { canGigantamax } = gen.species.get(teamState.team[tabIdx]?.species ?? '') ?? {};
  if (!canGigantamax) return null;

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>GMax</label>
      <div className="whitespace-nowrap">
        <label className="swap swap-flip">
          <input type="checkbox" checked={checked} onChange={(e) => handleChange(e)} />
          <span className="swap-on">🌟</span>
          <span className="swap-off">✖️</span>
        </label>
      </div>
    </div>
  );
}

export default GMaxSwitch;
