import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function LoadInShowdown() {
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
      data-tip="Please have the helper userscript installed to use this feature. See About page."
      onClick={handleClick}
    >
      <span>⚔️</span>
      <span>Load in Showdown</span>
    </button>
  );
}

export default LoadInShowdown;
