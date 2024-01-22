import { Specie } from '@pkmn/data';
import { Row } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import Loading from '@/components/layout/Loading';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';

type Data = {
  id: string;
  paste: string;
  title: string;
  author: string;
};

const pageSize = 5;

const Paginator = ({ page, setPage, disableNext }: { page: number; setPage: (p: number) => void; disableNext: boolean }) => {
  return (
    <div className="flex justify-center">
      <div className="btn-group">
        <button className="btn btn-sm" onClick={() => setPage(1)} disabled={page <= 1}>
          «
        </button>
        <button className="btn btn-sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
          ←
        </button>
        <button className="btn btn-sm">{page}</button>
        <button className="btn btn-sm" onClick={() => setPage(page + 1)} disabled={disableNext}>
          →
        </button>
      </div>
    </div>
  );
};

export const PresetsSubComponent = (row: Row<Specie>) => {
  const { t } = useTranslation(['common', 'species']);
  const { tabIdx, teamState } = useContext(StoreContext);
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error } = useSWR<Data[]>(
    // only fetch presets when the format is in the current generation
    teamState.format.includes(`gen${AppConfig.defaultGen}`) ? `/api/usages/presets/${row.original.name}?page=${pageIndex}&format=${teamState.format}` : null,
    (u) => fetch(u).then((r) => r.json()),
    { fallbackData: [] },
  );
  if (data == null) {
    return <Loading />;
  }
  const handlePresetClick = (preset: string) => {
    // replace current team with `preset` which is a PokemonSet.
    teamState.splicePokemonTeam(tabIdx, 1, Pokemon.importSet(preset));
  };

  return (
    <>
      {error || (Array.isArray(data) && data.length === 0) ? (
        <div className="w-full text-center">{t('common.preset.notFound')}</div>
      ) : (
        <div className="carousel carousel-center w-full rounded-box bg-base-300 p-1">
          <div className="carousel-item w-full justify-around">
            {data.map((p, i) => (
              <div key={i} className="card w-52 bg-base-100 shadow-xl lg:w-60 xl:w-80">
                <div className="card-body p-1 lg:p-2">
                  <h6 className="card-title overflow-hidden text-xs tracking-tight">@ [{p.title}]</h6>
                  <pre className="h-40 whitespace-pre-wrap text-xs leading-tight tracking-tighter">{p.paste}</pre>
                  <div className="card-actions justify-end">
                    <Link href={`/pastes/${p.id}/`} className="btn btn-secondary btn-xs lg:btn-sm" target="_blank">
                      {t('common.preset.showTeam')}
                    </Link>
                    <button type="button" className="btn btn-primary btn-xs lg:btn-sm" onClick={() => handlePresetClick(p.paste)}>
                      {t('common.apply')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Pagination */}
      <Paginator page={pageIndex} setPage={setPageIndex} disableNext={data.length < pageSize} />
    </>
  );
};
