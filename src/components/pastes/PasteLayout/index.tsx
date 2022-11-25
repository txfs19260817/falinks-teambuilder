import type { TypeEffectiveness } from '@pkmn/data';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { TeamTypeCategoryMatrix } from '@/components/table/TeamTypeCategoryMatrix';
import { TeamTypeChart } from '@/components/table/TeamTypeChart';
import { Pokemon } from '@/models/Pokemon';
import Loading from '@/templates/Loading';
import { S4 } from '@/utils/Helpers';
import { Paste } from '@/utils/Prisma';

const PasteAndFunctions = ({ team, paste }: { team: Pokemon[]; paste: NonNullable<Paste> }) => {
  const { locale, push } = useRouter();

  // handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(paste.paste).then(() => toast('📋 Copied!'));
  };

  const handleShare = () => {
    // try Web Share API first, fallback to copy link to clipboard
    try {
      navigator.share({
        text: paste.paste,
        url: window.location.href,
        title: paste.title,
      });
    } catch (e) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast('📋 The link has been copied to your clipboard as your browser does not support Web Share API.'));
    }
  };

  const handleOpenInRoom = () => {
    push(`/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${Pokemon.convertPasteToPackedTeam(paste.paste)}`);
  };

  return (
    <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-3">
      {/* avatars */}
      <div className="hidden grid-rows-6 md:grid">
        {team.map((p) => (
          <PureSpriteAvatar key={p.species} species={p.species} shiny={p.shiny} />
        ))}
      </div>
      <div className="grid w-1/2 grid-cols-3 justify-items-center align-middle md:hidden">
        {team.map(({ species }) => (
          <PokemonIcon speciesId={species} key={species} />
        ))}
      </div>
      {/* paste */}
      <pre className="ml-5 w-4/5 whitespace-pre-wrap">{paste.paste}</pre>
      {/* metadata */}
      <div className="prose ml-5 w-4/5 py-6">
        <h1>{paste.title}</h1>
        <h3>Author: {paste.author}</h3>
        <ul>
          <li>Format: {paste.format}</li>
          <li>
            Created at:{' '}
            {new Intl.DateTimeFormat(locale ?? 'en-US', {
              dateStyle: 'long',
            }).format(new Date(paste.createdAt))}
          </li>
          <li className="break-all">Source: {paste.source || 'None'}</li>
          <li>Rental Code: {paste.rentalCode || 'None'}</li>
        </ul>
        <p className="break-all">Notes: {paste.notes}</p>
        <div className="flex justify-around">
          <button className="btn-primary btn-sm btn" type="button" onClick={handleCopy}>
            Copy PokePaste
          </button>
          <button className="btn-secondary btn-sm btn" type="button" onClick={handleShare}>
            Share
          </button>
          <button className="btn-accent btn-sm btn" type="button" onClick={handleOpenInRoom}>
            Open in Room
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamInsight = ({ team }: { team: Pokemon[] }) => {
  const { t } = useTranslation('table');
  const { defenseMap, offenseMap, defenseTeraMap } = Pokemon.getTeamTypeChart(team);
  return (
    <div className="flex flex-col gap-2 overflow-x-auto p-2">
      <h1 className="text-2xl font-bold">{t('insights')}</h1>
      {/* type category matrix */}
      <h2 className="text-xl font-bold">{t('type_category_matrix')}</h2>
      <TeamTypeCategoryMatrix teamMemberCategories={Pokemon.getTeamMemberCategories(team)} />
      {/* defense map */}
      <h2 className="text-xl font-bold">{t('defense')}</h2>
      <TeamTypeChart teamTypeChart={defenseMap} additionalTypeChart={defenseTeraMap} direction={'defense'} />
      {/* offense map */}
      <h2 className="text-xl font-bold">{t('offense')}</h2>
      <TeamTypeChart<TypeEffectiveness> teamTypeChart={offenseMap} direction={'offense'} />
    </div>
  );
};

const tabs = ['Team', 'Insights'] as const;
type Tabs = typeof tabs[number];

const PasteLayout = ({ id }: { id: string }) => {
  const { t } = useTranslation('table');
  const [currentTab, setCurrentTab] = useState<Tabs>('Team');
  const { data: paste, error } = useSWRImmutable<Paste>(id, (i) => fetch(`/api/pastes/${i}`).then((res) => res.json()));

  if (error) {
    toast.error('An error occurred while fetching the paste.');
    return null;
  }
  if (!paste) return <Loading />;
  const team = Pokemon.convertPasteToTeam(paste.paste) || [];

  return (
    <>
      <div className="tabs tabs-boxed">
        {['Team', 'Insights'].map((tab) => (
          <a key={tab} className={`tab ${currentTab === tab ? 'tab-active' : ''}`} onClick={() => setCurrentTab(tab as Tabs)}>
            {t(tab.toLowerCase())}
          </a>
        ))}
      </div>
      {currentTab === 'Team' && <PasteAndFunctions team={team} paste={paste} />}
      {currentTab === 'Insights' && <TeamInsight team={team} />}
    </>
  );
};

export default PasteLayout;
