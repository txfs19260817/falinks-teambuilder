import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/StoreContext';

function ShinyToggle() {
  const { teamState, tabIdx } = useContext(StoreContext);
  const [checked, setChecked] = useState(false);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setChecked(teamState.team[tabIdx]?.shiny || false);
  }, [teamState.team[tabIdx]?.shiny]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].shiny = newChecked;
  };

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>Shiny</label>
      <div className="whitespace-nowrap">
        <label className="swap swap-flip">
          <input type="checkbox" checked={checked} onChange={(e) => handleChange(e)} />
          <span className="swap-on">✨</span>
          <span className="swap-off">✖️</span>
        </label>
      </div>
    </div>
  );
}

export default ShinyToggle;
