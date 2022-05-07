import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { PanelProps } from '@/components/workspace/types';

export function GmaxToggle({ tabIdx, teamState }: PanelProps) {
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
    setChecked(newChecked);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].gigantamax = newChecked;
  };

  /*
   * isChangable is true allows the user to toggle gigantamax
   * isGigantamax is true <=> gigantamax is always true
   * */

  // @ts-ignore
  const { canGigantamax: isChangable, isNonstandard } = gen.species.get(teamState.team[tabIdx]?.species ?? '') ?? {};
  const isGigantamax = isNonstandard === 'Gigantamax';

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>G-Max: </label>
      <div className="whitespace-nowrap">
        <label className={`swap ${isGigantamax ? 'swap-active' : 'swap-flip'}`}>
          <input type="checkbox" checked={checked} onChange={(e) => handleChange(e)} disabled={!isChangable} />
          <span className="swap-on">🌟</span>
          <span className="swap-off">✖️</span>
        </label>
      </div>
    </div>
  );
}
