import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useId, useMemo, useState } from 'react';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { FormatSelector } from '@/components/select/FormatSelector';
import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import { PokemonFilter } from '@/components/usages/PokemonFilter';
import { SpreadTable } from '@/components/usages/SpreadTable';
import UsageStats from '@/components/usages/UsageStats';
import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';
import { Usage } from '@/utils/Types';

type UsagePageProps = {
  usages: Usage[];
  format: string;
  formatOptions?: string[];
  title?: string;
};

const UsageLayout = ({ usages, title, format, formatOptions = AppConfig.formats }: UsagePageProps) => {
  const drawerID = useId();
  const { push, pathname } = useRouter();
  const { t } = useTranslation(['common']);
  const [selectedRank, setSelectedRank] = useState<number>(usages?.at(0)?.rank ?? 0);
  const pokeUsage = useMemo<Usage | undefined>(() => {
    return (usages || []).find((u) => u.rank === selectedRank);
  }, [selectedRank, usages]);

  // Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button
  return (
    <div className="drawer-mobile drawer h-main">
      <input id={drawerID} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-300">
        {/* nav that only shows on mobile */}
        <nav className="navbar rounded-box w-full shadow-2xl lg:hidden">
          <div className="flex-none">
            <label htmlFor={drawerID} className="btn-ghost btn-square btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">{title || `${t('common.usage')} - ${format}`}</div>
        </nav>
        {/* Main Content */}
        {pokeUsage && (
          <div className="grid gap-4 p-4 md:grid-cols-2">
            {/* Info Card */}
            <InfoCard speciesName={pokeUsage.name} />
            {/* Usage */}
            <UsageStats pokeUsage={pokeUsage} />
            {/* Items table */}
            <BaseTable
              tableTitle="items"
              category="items"
              usages={pokeUsage.Items as Record<string, number>}
              nameGetter={(k) => DexSingleton.getGen().items.get(k)?.name ?? k}
              iconGetter={(k) => <ItemIcon itemName={k} />}
            />
            {/* Moves table */}
            <BaseTable
              tableTitle="moves"
              category="moves"
              usages={pokeUsage.Moves as Record<string, number>}
              nameGetter={(k) => DexSingleton.getGen().moves.get(k)?.name ?? k}
              iconGetter={(k) => <RoundTypeIcon typeName={DexSingleton.getGen().moves.get(k)?.type ?? '???'} />}
            />
            {/* Teammates table */}
            <BaseTable
              tableTitle="teammates"
              category="species"
              usages={pokeUsage.Teammates as Record<string, number>}
              nameGetter={(k) => DexSingleton.getGen().species.get(k)?.name ?? k}
              iconGetter={(k) => <PokemonIcon speciesId={k} />}
            />
            {/* Spreads table */}
            {Object.keys(pokeUsage.Spreads).length > 0 && <SpreadTable usages={pokeUsage.Spreads as Record<string, number>} />}
            {/* Tera types table (if available) */}
            {pokeUsage.TeraTypes && (
              <BaseTable
                tableTitle="teraType"
                category="types"
                usages={pokeUsage.TeraTypes}
                nameGetter={(k) => DexSingleton.getGen().types.get(k)?.name ?? k}
                iconGetter={(k) => <RoundTypeIcon typeName={DexSingleton.getGen().types.get(k)?.name ?? '???'} />}
              />
            )}
          </div>
        )}
      </div>
      {/* Drawer side */}
      <div className="drawer-side">
        <label htmlFor={drawerID} className="drawer-overlay"></label>
        <ul className="menu rounded-r-box w-80 border border-base-content/30 bg-base-200 p-4">
          {(formatOptions?.length ?? 0) > 0 && (
            <FormatSelector
              formats={formatOptions}
              defaultFormat={format}
              handleChange={(e) => {
                push({ pathname, query: { format: e.target.value } }).then(() => setSelectedRank(0));
              }}
            />
          )}
          <PokemonFilter usages={usages} drawerID={drawerID} setSelectedRank={setSelectedRank} />
        </ul>
      </div>
    </div>
  );
};

export { UsageLayout };
