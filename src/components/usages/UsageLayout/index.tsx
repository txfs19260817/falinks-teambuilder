import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useId, useMemo, useState } from 'react';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { formatOptionElements, FormatSelector } from '@/components/select/FormatSelector';
import BaseTable from '@/components/usages/BaseTable';
import InfoCard from '@/components/usages/InfoCard';
import { PokemonFilter } from '@/components/usages/PokemonFilter';
import { SpreadTable } from '@/components/usages/SpreadTable';
import UsageStats from '@/components/usages/UsageStats';
import DexSingleton from '@/models/DexSingleton';
import FormatManager from '@/models/FormatManager';
import type { Format, Usage } from '@/utils/Types';

type UsagePageProps = {
  usages: Usage[];
  formatId: string;
  formatIdOptions?: string[];
  title?: string;
};

const UsagePanels = ({ pokeUsage }: { pokeUsage: Usage }) => {
  return (
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
        iconGetter={(k) => <RoundTypeIcon isRound={true} typeName={DexSingleton.getGen().moves.get(k)?.type ?? '???'} />}
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
  );
};

const MobileNavbar = ({ title, drawerID }: { title: string; drawerID: string }) => {
  return (
    <nav className="navbar w-full rounded-box shadow-2xl lg:hidden">
      <div className="flex-none">
        <label htmlFor={drawerID} className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="mx-2 flex-1 px-2">{title}</div>
    </nav>
  );
};

const DrawerSidebar = ({
  usages,
  drawerID,
  setSelectedRank,
  formatIdOptions,
  formatId,
  formatManager,
}: {
  usages: Usage[];
  drawerID: string;
  setSelectedRank: (rank: number) => void;
  formatIdOptions?: string[];
  formatId: string;
  formatManager: FormatManager;
}) => {
  const { push, pathname } = useRouter();

  return (
    <div className="drawer-side h-full">
      <label htmlFor={drawerID} className="drawer-overlay"></label>
      <ul className="menu w-80 gap-y-2 rounded-r-box border border-base-content/30 bg-base-200 p-4">
        {(formatIdOptions?.length ?? 0) > 0 && (
          <FormatSelector
            className="select select-bordered select-sm w-64 overflow-ellipsis"
            defaultFormat={formatId}
            onChange={(e) => {
              push({ pathname, query: { format: e.target.value } }).then(() => setSelectedRank(0));
            }}
            options={formatOptionElements(formatIdOptions?.map(formatManager.getFormatById).filter((f) => f !== undefined) as Format[])}
          />
        )}
        <PokemonFilter usages={usages} drawerID={drawerID} setSelectedRank={setSelectedRank} />
      </ul>
    </div>
  );
};

const UsageLayout = ({ usages, title, formatId, formatIdOptions }: UsagePageProps) => {
  const drawerID = useId();
  const { t } = useTranslation(['common']);
  const [selectedRank, setSelectedRank] = useState<number>(usages?.at(0)?.rank ?? 0);
  const pokeUsage = useMemo<Usage | undefined>(() => {
    return (usages || []).find((u) => u.rank === selectedRank);
  }, [selectedRank, usages]);
  const formatManager = useMemo(() => new FormatManager(), []);

  // Desktop: show drawer w/o Navbar; Mobile: show Navbar w/ a drawer button
  return (
    <div className="drawer h-main lg:drawer-open">
      <input id={drawerID} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-300">
        <MobileNavbar drawerID={drawerID} title={title || `${t('common.usage')} - ${formatId}`}></MobileNavbar>
        {/* Main Content */}
        {pokeUsage && <UsagePanels pokeUsage={pokeUsage} />}
      </div>
      {/* Drawer side */}
      <DrawerSidebar
        usages={usages}
        drawerID={drawerID}
        setSelectedRank={setSelectedRank}
        formatIdOptions={formatIdOptions}
        formatId={formatId}
        formatManager={formatManager}
      />
    </div>
  );
};

export default UsageLayout;
