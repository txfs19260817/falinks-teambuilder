import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import DexSingleton from '@/models/DexSingleton';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { getPokemonTranslationKey, isValidPokePasteURL } from '@/utils/PokemonUtils';
import type { BasePokePaste } from '@/utils/Types';

type PokePasteWithTeam = BasePokePaste & { team: Pokemon[] };

const MatchupPage = () => {
  const { t } = useTranslation(['tools', 'common', 'items', 'moves', 'species', 'abilities', 'types']);
  const sides = ['left', 'right'] as const;
  const defaultTeam = (side: (typeof sides)[number]) => ({
    author: t('common.player') + (side === 'left' ? '1' : '2'),
    format: '',
    notes: '',
    title: '',
    paste: '',
    team: [],
  });
  const [leftTeam, setLeftTeam] = useState<PokePasteWithTeam>(defaultTeam('left'));
  const [rightTeam, setRightTeam] = useState<PokePasteWithTeam>(defaultTeam('right'));
  const [leftContent, setLeftContent] = useState<string>(''); // can be either a PokePaste URL or a team string
  const [rightContent, setRightContent] = useState<string>('');
  const [visiblePanels, setVisiblePanels] = useState<Record<(typeof sides)[number], boolean>>({
    left: true,
    right: true,
  });
  const showDivider = visiblePanels.left && visiblePanels.right;

  // on change of the textarea, check if it's a valid PokePaste URL or a paste string
  const handleUrlChange = (side: (typeof sides)[number]) => (s: string) => {
    if (isValidPokePasteURL(s)) {
      Pokemon.pokePasteURLFetcher(s).then((data) => {
        const team = Pokemon.convertPasteToTeam(data.paste) ?? [];
        const author = data.title && data.title.includes("'s") ? data.title.split("'s")[0] : data.author ?? t('common.player') + (side === 'left' ? '1' : '2');
        if (side === 'left') {
          setLeftContent(s);
          setLeftTeam({ ...data, team, author });
        } else {
          setRightContent(s);
          setRightTeam({ ...data, team, author });
        }
      });
    } else {
      // assume it's a team string
      const team = Pokemon.convertPasteToTeam(s) ?? [];
      const paste = s.includes('\n') ? s : Pokemon.convertTeamToPaste(team);
      if (side === 'left') {
        setLeftContent(paste);
        setLeftTeam({
          ...defaultTeam('left'),
          team,
          paste,
        });
      } else {
        setRightContent(paste);
        setRightTeam({
          ...defaultTeam('right'),
          team,
          paste,
        });
      }
    }
  };

  // on mount, check if there are any query params
  useEffect(() => {
    const url = new URL(window.location.href);
    sides.forEach((side) => {
      const v = url.searchParams.get(side);
      if (v) {
        handleUrlChange(side)(v);
      }
    });
  }, []);

  const BtnGroup = () => {
    // use Web Share API if available
    const handleShareableLink = () => {
      const leftPackedTeam = Pokemon.convertPasteToPackedTeam(leftTeam.paste);
      const rightPackedTeam = Pokemon.convertPasteToPackedTeam(rightTeam.paste);
      const url = new URL(window.location.href);
      url.searchParams.set('left', leftPackedTeam);
      url.searchParams.set('right', rightPackedTeam);
      // try Web Share API first, fallback to copy link to clipboard
      try {
        navigator.share({
          url: url.toString(),
          title: `${window.document.title} - ${leftTeam.author} (${leftTeam.team.map((p) => p.species).join(', ')}) vs ${rightTeam.author} (${rightTeam.team
            .map((p) => p.species)
            .join(', ')})`,
        });
      } catch (e) {
        navigator.clipboard.writeText(url.toString());
      }
    };
    // Handle hide/show buttons
    const toggleHide = (side: (typeof sides)[number]) => () => {
      setVisiblePanels((prev) => ({ ...prev, [side]: !prev[side] }));
    };
    return (
      <div className="btn-group-sm btn-group my-3 w-full text-center">
        <button className="btn-block btn w-1/3" onClick={toggleHide('left')}>
          {`← ${visiblePanels.left ? t('common.hide') : t('common.show')}`}
        </button>
        <button className="btn-primary btn-block btn w-1/3" onClick={handleShareableLink}>
          {t('common.share')}
          <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24px" height="24px" viewBox="0 0 483 483" stroke="currentColor">
            <path
              d="M395.72,0c-48.204,0-87.281,39.078-87.281,87.281c0,2.036,0.164,4.03,0.309,6.029l-161.233,75.674
		c-15.668-14.971-36.852-24.215-60.231-24.215c-48.204,0.001-87.282,39.079-87.282,87.282c0,48.204,39.078,87.281,87.281,87.281
		c15.206,0,29.501-3.907,41.948-10.741l69.789,58.806c-3.056,8.896-4.789,18.396-4.789,28.322c0,48.204,39.078,87.281,87.281,87.281
		c48.205,0,87.281-39.078,87.281-87.281s-39.077-87.281-87.281-87.281c-15.205,0-29.5,3.908-41.949,10.74l-69.788-58.805
		c3.057-8.891,4.789-18.396,4.789-28.322c0-2.035-0.164-4.024-0.308-6.029l161.232-75.674c15.668,14.971,36.852,24.215,60.23,24.215
		c48.203,0,87.281-39.078,87.281-87.281C482.999,39.079,443.923,0,395.72,0z"
            />
          </svg>
        </button>
        <button className="btn-block btn w-1/3" onClick={toggleHide('right')}>
          {`${visiblePanels.right ? t('common.hide') : t('common.show')} →`}
        </button>
      </div>
    );
  };

  const TeamGrid = ({ side }: { side: (typeof sides)[number] }) => {
    // Clear the team on the given side
    const handleClear = () => {
      if (side === 'left') {
        setLeftContent('');
        setLeftTeam(defaultTeam('left'));
      } else {
        setRightContent('');
        setRightTeam(defaultTeam('right'));
      }
    };

    return (
      <>
        <div className="my-1 flex w-full gap-1">
          <textarea
            aria-label="PokePaste URL or text"
            className="textarea w-full"
            value={side === 'left' ? leftContent : rightContent}
            rows={2}
            placeholder={t('tools.matchup.placeholder')}
            onChange={(e) => handleUrlChange(side)(e.target.value)}
          />
          {/* Buttons */}
          <button className="btn-error btn-sm btn self-center" onClick={handleClear}>
            🗑️
          </button>
        </div>
        <div
          className={`grid w-full grid-cols-1 gap-2${
            showDivider ? ' text-sm md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 xl:text-xs 2xl:text-sm' : ' md:grid-cols-2'
          }`}
        >
          {(side === 'left' ? leftTeam?.team : rightTeam?.team)?.map(({ ability, item, moves, shiny, species, teraType }, index) => (
            <div key={index} className="rounded-box grid grid-cols-3 gap-2 bg-base-100 px-3 py-2 shadow-2xl">
              <div>
                <PureSpriteAvatar speciesId={species} shiny={shiny} gen={9} showName={true} />
              </div>
              <div className="flex flex-col justify-evenly border-x-2 border-base-300">
                {/* Tera Type */}
                <div className="flex items-center justify-center">
                  {teraType && <RoundTypeIcon typeName={teraType} isTeraType={true} />}
                  <span>{t(getPokemonTranslationKey(teraType ?? '', 'types'))}</span>
                </div>
                {/* Ability */}
                <div className="flex items-center justify-center">
                  <span>{t(getPokemonTranslationKey(ability ?? '', 'abilities'))}</span>
                </div>
                {/* Item */}
                <div className="flex items-center justify-center">
                  <ItemIcon itemName={item} />
                  <span>{t(getPokemonTranslationKey(item ?? '', 'items'))}</span>
                </div>
              </div>
              {/* Moves */}
              <div className="flex flex-col justify-evenly">
                {moves.map((moveName, mi) => {
                  const move = DexSingleton.getGen().moves.get(moveName);
                  return (
                    <div key={mi} className="flex items-center border-b-2 border-base-300">
                      <RoundTypeIcon typeName={move?.type ?? ''} />
                      <span>{t(getPokemonTranslationKey(move?.name ?? '', 'moves'))}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Main title={t('common.routes.matchup.title')} description={t('common.routes.matchup.description')}>
      <h1 className="my-4 text-center text-xl font-bold leading-relaxed tracking-tight sm:text-2xl sm:leading-none md:text-3xl">{t('tools.matchup.title')}</h1>
      <BtnGroup />
      {/* 2 cols */}
      <div className="flex w-full flex-col justify-between lg:flex-row">
        {['left', 'divider', 'right'].map((side) =>
          side === 'divider' ? (
            <div key={side} className={`${showDivider ? 'divider lg:divider-horizontal' : 'hidden'}`}>
              VS.
            </div>
          ) : (
            <div
              key={side}
              className={`card rounded-box flex-grow place-items-center px-4 py-2${side === 'left' ? ' bg-primary/10' : ' bg-secondary/10'}${
                visiblePanels[side as (typeof sides)[number]] ? ' grid' : ' hidden'
              }${visiblePanels[side === 'left' ? 'right' : 'left'] ? ' lg:max-w-[50%]' : ''}}`}
            >
              <h2 className="text-center text-xl font-bold">{side === 'left' ? leftTeam.author : rightTeam.author}</h2>
              <TeamGrid key={side} side={side as (typeof sides)[number]} />
            </div>
          )
        )}
      </div>
    </Main>
  );
};

export const getServerSideProps = async (context: { locale?: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', ['tools', 'common', 'items', 'moves', 'species', 'abilities', 'types'])),
    },
  };
};

export default MatchupPage;
