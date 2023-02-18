import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChangeEvent, useState } from 'react';

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
  const defaultTeam = (side: typeof sides[number]) => ({
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
  const handleClear = (side: typeof sides[number]) => () => {
    if (side === 'left') {
      setLeftTeam(defaultTeam('left'));
      setLeftContent('');
    } else {
      setRightTeam(defaultTeam('right'));
      setRightContent('');
    }
  };
  const handleUrlChange = (side: typeof sides[number]) => (event: ChangeEvent<HTMLTextAreaElement>) => {
    const s = event.target.value;
    if (side === 'left') {
      setLeftContent(s);
    } else {
      setRightContent(s);
    }
    if (isValidPokePasteURL(s)) {
      Pokemon.pokePasteURLFetcher(s).then((data) => {
        const team = Pokemon.convertPasteToTeam(data.paste) ?? [];
        const author = data.title && data.title.includes("'s") ? data.title.split("'s")[0] : data.author ?? t('common.player') + (side === 'left' ? '1' : '2');
        if (side === 'left') {
          setLeftTeam({ ...data, team, author });
        } else {
          setRightTeam({ ...data, team, author });
        }
      });
    } else {
      // assume it's a team string
      const team = Pokemon.convertPasteToTeam(s) ?? [];
      if (side === 'left') {
        setLeftTeam({ ...defaultTeam('left'), team });
      } else {
        setRightTeam({ ...defaultTeam('right'), team });
      }
    }
  };

  const TeamGrid = ({ side }: { side: typeof sides[number] }) => {
    return (
      <>
        <div className="my-1 flex w-full gap-1">
          <textarea
            aria-label={side === 'left' ? 'Left side URL' : 'Right side URL'}
            className="textarea w-full"
            value={side === 'left' ? leftContent : rightContent}
            rows={2}
            placeholder={t('tools.matchup.placeholder')}
            onChange={handleUrlChange(side)}
          />
          <button className="btn-error btn self-center" onClick={handleClear(side)}>
            🗑️
          </button>
        </div>
        <div className="grid w-full grid-rows-6 gap-2">
          {(side === 'left' ? leftTeam?.team : rightTeam?.team)?.map(({ ability, item, moves, shiny, species, teraType }, index) => (
            <div key={index} className="rounded-box grid grid-cols-3 gap-2 bg-base-100 px-3 py-2 shadow-2xl">
              <div>
                <PureSpriteAvatar speciesId={species} shiny={shiny} gen={9} showName={true} />
              </div>
              <div className="flex flex-col justify-evenly border-x-2 border-base-300">
                {/* Tera Type */}
                <div className="flex items-center justify-center">
                  <label className="hidden md:inline">{t('common.teraType')}: </label>
                  {teraType && <RoundTypeIcon typeName={teraType} isTeraType={true} />}
                  <span>{t(getPokemonTranslationKey(teraType ?? '', 'types'))}</span>
                </div>
                {/* Ability */}
                <div className="flex items-center justify-center">
                  <label className="hidden md:inline">{t('common.ability')}: </label>
                  <span>{t(getPokemonTranslationKey(ability ?? '', 'abilities'))}</span>
                </div>
                {/* Item */}
                <div className="flex items-center justify-center">
                  <label className="hidden md:inline">{t('common.item')}: </label>
                  <ItemIcon itemName={item} />
                  <span>{t(getPokemonTranslationKey(item ?? '', 'items'))}</span>
                </div>
              </div>
              {/* Moves */}
              <div className="flex flex-col justify-evenly">
                {moves.map((moveName, mi) => {
                  const move = DexSingleton.getGen().moves.get(moveName);
                  return (
                    <div key={mi} className="flex items-center">
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
    <Main title={t('common.routes.tournament.title')} description={t('common.routes.tournament.description')}>
      <h1 className="my-4 text-center text-xl font-bold leading-relaxed tracking-tight sm:text-2xl sm:leading-none md:text-3xl">{t('tools.matchup.title')}</h1>
      {/* 2 × 6 grids */}
      <div className="flex w-full flex-col justify-between lg:flex-row">
        {['left', 'divider', 'right'].map((side) =>
          side === 'divider' ? (
            <div key={side} className="divider lg:divider-horizontal">
              VS.
            </div>
          ) : (
            <div key={side} className="card rounded-box grid flex-grow place-items-center bg-base-300 px-4 py-2 lg:max-w-[50%]">
              <h2 className="text-center text-xl font-bold">{side === 'left' ? leftTeam.author : rightTeam.author}</h2>
              <TeamGrid key={side} side={side as typeof sides[number]} />
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
