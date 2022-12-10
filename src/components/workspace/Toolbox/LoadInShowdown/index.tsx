import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function LoadInShowdown() {
  const { t } = useTranslation(['room']);
  const { teamState } = useContext(StoreContext);
  const { format, title } = teamState;

  const psURL = () => {
    const packedTeam = teamState.getTeamPaste(true, true, format, title);
    return packedTeam.length > 0 ? `https://play.pokemonshowdown.com/teambuilder#${packedTeam}` : 'https://play.pokemonshowdown.com/teambuilder';
  };

  const handleClick = () => {
    window.open(psURL(), '_blank');
  };

  return (
    <button
      id={AppConfig.toolboxIDs.loadInShowdown}
      className="btn-ghost tooltip tooltip-right btn font-medium normal-case"
      data-tip={t('room.toolbox.load-in-showdown-btn.description')}
      onClick={handleClick}
    >
      <span>⚔️</span>
      <span>{t('room.toolbox.load-in-showdown-btn.text')}</span>
    </button>
  );
}

export default LoadInShowdown;
