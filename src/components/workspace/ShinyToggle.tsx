import { ChangeEvent, useEffect, useState } from 'react';

import { PanelProps } from '@/components/workspace/types';

export function ShinyToggle({ tabIdx, teamState }: PanelProps) {
  const [checked, setChecked] = useState(false);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].shiny = newChecked;
  };

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setChecked(teamState.team[tabIdx]?.shiny || false);
  }, [teamState.team[tabIdx]?.shiny]);

  return (
    <div className="flex space-x-0.5 text-sm lg:text-lg">
      <label>Shiny: </label>
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
