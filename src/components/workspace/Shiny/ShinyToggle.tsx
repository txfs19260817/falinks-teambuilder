import { useTranslation } from 'next-i18next';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

function ShinyToggle() {
  const { t } = useTranslation();
  const { teamState, tabIdx } = useContext(StoreContext);
  const [checked, setChecked] = useState(false);

  // receive changes from other users
  useEffect(() => {
    setChecked(teamState.getPokemonInTeam(tabIdx)?.shiny ?? false);
  }, [teamState.getPokemonInTeam(tabIdx)?.shiny]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    teamState.updatePokemonInTeam(tabIdx, 'shiny', e.target.checked);
  };

  return (
    <div className="md:text-md flex inline-flex space-x-0.5 text-xs">
      <label>{t('common.shiny')}</label>
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
