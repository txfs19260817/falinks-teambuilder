import { replay } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import Loading from '@/templates/Loading';
import { S4 } from '@/utils/Helpers';
import { Paste } from '@/utils/Prisma';

const TeamInsight = dynamic(() => import('@/components/pastes/TeamInsight'), {
  ssr: false,
  loading: () => <Loading />,
});
const ReplaysTable = dynamic(() => import('@/components/replays/ReplaysTable'), {
  ssr: false,
  loading: () => <Loading />,
});

const PasteAndFunctions = ({ team, paste }: { team: Pokemon[]; paste: NonNullable<Paste> }) => {
  const { locale, push } = useRouter();
  const { t } = useTranslation(['common']);
  const [showTranslated, setShowTranslated] = useState(false);
  const translatedPaste = Pokemon.convertTeamToTranslatedPaste(Pokemon.convertPasteToTeam(paste.paste) || [], t);

  // handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(paste.paste).then(() => toast(t('common.copiedToClipboard')));
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
      navigator.clipboard.writeText(window.location.href).then(() => toast(t('common.webApiNotSupported')));
    }
  };

  const handleOpenInRoom = () => {
    push(`/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${Pokemon.convertPasteToPackedTeam(paste.paste)}`);
  };

  const handleLoadInShowdown = () => {
    window.open(
      `https://play.pokemonshowdown.com/teambuilder#${Pokemon.convertPasteToPackedTeam(paste.paste, {
        format: paste.format,
        name: paste.title,
      })}`,
      '_blank'
    );
  };

  return (
    <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-3">
      {/* avatars */}
      <div className="hidden grid-rows-6 md:grid">
        {team.map((p) => (
          <PureSpriteAvatar key={p.species} speciesId={p.species} shiny={p.shiny} />
        ))}
      </div>
      <div className="grid w-1/2 grid-cols-3 justify-items-center align-middle md:hidden">
        {team.map(({ species }) => (
          <PokemonIcon speciesId={species} key={species} />
        ))}
      </div>
      {/* paste */}
      {showTranslated && locale !== 'en' ? (
        <pre className="ml-5 w-4/5 whitespace-pre-wrap">{translatedPaste}</pre>
      ) : (
        <pre className="ml-5 w-4/5 whitespace-pre-wrap">{paste.paste}</pre>
      )}
      {/* metadata */}
      <div className="prose row-start-1 ml-5 w-4/5 py-6">
        <h1>{paste.title}</h1>
        <h3>
          {t('common.author')}: {paste.author}
        </h3>
        <ul>
          <li>
            {t('common.format')}: {paste.format}
          </li>
          <li>
            {t('common.createdAt')}:{' '}
            {new Intl.DateTimeFormat(locale ?? 'en-US', {
              dateStyle: 'long',
            }).format(new Date(paste.createdAt))}
          </li>
          <li className="break-all">
            {t('common.source')}: {paste.source || '-'}
          </li>
          <li>
            {t('common.rentalCode')}: {paste.rentalCode || '-'}
          </li>
        </ul>
        <p className="break-all">
          {t('common.notes')}: {paste.notes}
        </p>
        <div className="form-control justify-around gap-1.5">
          <label className="label cursor-pointer">
            <span className="label-text">PokePaste</span>
            <input type="checkbox" className="toggle-primary toggle" checked={showTranslated} onChange={() => setShowTranslated((s) => !s)} />
            <span className="label-text">{t('paste.showTranslation')}</span>
          </label>
          <button className="btn-primary btn-sm btn" type="button" onClick={handleCopy}>
            {t('common.copy')} PokePaste
          </button>
          <button className="btn-secondary btn-sm btn" type="button" onClick={handleShare}>
            {t('common.share')}
          </button>
          <button className="btn-accent btn-sm btn" type="button" onClick={handleOpenInRoom}>
            {t('paste.openInRoom')}
          </button>
          <button className="btn-info tooltip tooltip-top btn-sm btn" data-tip={t('paste.loadInShowdown.description')} onClick={handleLoadInShowdown}>
            {t('paste.loadInShowdown.title')}
          </button>
        </div>
      </div>
    </div>
  );
};

const tabs = ['Team', 'Insights', 'Replays'] as const;
type Tabs = typeof tabs[number];

const PasteLayout = ({ id }: { id: string }) => {
  const { t } = useTranslation(['common']);
  const [currentTab, setCurrentTab] = useState<Tabs>('Team');
  const { data: paste, error } = useSWRImmutable<Paste>(id, (i) => fetch(`/api/pastes/${i}`).then((res) => res.json()));
  const { data: replays } = useSWRImmutable<replay[]>(paste?.format && paste?.paste ? Pokemon.extractSpeciesFromPaste(paste.paste).join(',') : null, (k) =>
    fetch(`/api/replays/teams?format=${paste?.format}&species=${k}`).then((r) => r.json())
  );

  if (error) {
    toast.error('An error occurred while fetching the paste.');
    return null;
  }
  if (!paste) return <Loading />;
  const team = Pokemon.convertPasteToTeam(paste.paste) || [];

  return (
    <>
      <div className="tabs tabs-boxed">
        {tabs.map((tab) => (
          <a key={tab} className={`tab ${currentTab === tab ? 'tab-active' : ''}`} onClick={() => setCurrentTab(tab as Tabs)}>
            {t(tab.toLowerCase())}
          </a>
        ))}
      </div>
      {currentTab === 'Team' && <PasteAndFunctions team={team} paste={paste} />}
      {currentTab === 'Insights' && <TeamInsight team={team} />}
      {currentTab === 'Replays' && <ReplaysTable replays={replays ?? []} />}
    </>
  );
};

export default PasteLayout;
