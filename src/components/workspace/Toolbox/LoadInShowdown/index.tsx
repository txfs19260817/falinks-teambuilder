import Link from 'next/link';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function LoadInShowdown() {
  const { teamState } = useContext(StoreContext);

  const packedTeam = teamState.getTeamPaste(true, true, AppConfig.defaultFormat, teamState.title);
  const psURL = packedTeam.length > 0 ? `https://play.pokemonshowdown.com/teambuilder#${packedTeam}` : 'https://play.pokemonshowdown.com/teambuilder';
  return (
    <Link href={psURL}>
      <a
        id={AppConfig.toolboxIDs.loadInShowdown}
        target="_blank"
        className="tooltip tooltip-right rounded hover:border-none"
        data-tip="Please have the helper userscript installed to use this feature. See About page."
      >
        <span>⚔️</span>
        <span>Load in Showdown</span>
      </a>
    </Link>
  );
}

export default LoadInShowdown;
