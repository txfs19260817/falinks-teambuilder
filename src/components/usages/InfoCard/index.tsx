import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import DexSingleton from '@/models/DexSingleton';
import { getPokemonTranslationKey, wikiLink } from '@/utils/PokemonUtils';

function InfoCard({ speciesName }: { speciesName: string }) {
  const { locale } = useRouter();
  const { t } = useTranslation(['usages', 'species']);

  const { types, baseStats } = DexSingleton.getDex().species.get(speciesName);
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Avatar */}
      <PureSpriteAvatar species={speciesName} />
      <div className="card-body">
        {/* Name */}
        <div className="card-title">
          <h2>
            {t(getPokemonTranslationKey(speciesName, 'species'), {
              ns: 'species',
            })}
          </h2>
          <div className="flex flex-row gap-2">
            {types.map((typeName) => (
              <RoundTypeIcon key={typeName} typeName={typeName} />
            ))}
          </div>
        </div>
        {/* Content */}
        <div role="list" className="grid lg:grid-cols-1">
          <div role="listitem">
            {Object.entries(baseStats).map(([stat, value]) => (
              <div role="progressbar" key={stat} className="flex flex-wrap items-center justify-between px-1 text-sm">
                <label className="w-1/5 break-keep uppercase">{t(`common.stats.${stat}`)}: </label>
                <meter className="flex-1" min={0} max={256} low={80} high={100} optimum={130} value={value} title={`${value}`} />
                <label className="w-1/12">{value}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Card Buttons */}
        <div className="card-actions justify-end">
          <a className="btn-primary btn-sm btn" href={wikiLink(speciesName, locale)} target="_blank" rel="noreferrer" title={t('usages.openInWiki')}>
            {t('usages.openInWiki')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
