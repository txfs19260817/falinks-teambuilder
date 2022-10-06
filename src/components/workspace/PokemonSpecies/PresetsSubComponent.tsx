import { Specie } from '@pkmn/data';
import { Row } from '@tanstack/react-table';
import { WithId } from 'mongodb';
import Link from 'next/link';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import Loading from '@/templates/Loading';

const pageSize = 5;

export const PresetsSubComponent = (row: Row<Specie>) => {
  const { tabIdx, teamState } = useContext(StoreContext);
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error } = useSWR<WithId<PokePaste>[]>(`/api/usages/presets/${row.original.name}?page=${pageIndex}`, (url) => fetch(url).then((r) => r.json()));
  if (error || (Array.isArray(data) && data.length === 0)) return <div className="w-full text-center">No Preset found</div>;
  if (!data) {
    return <Loading />;
  }
  const handlePresetClick = (preset: string) => {
    // replace current team with `preset` which is a PokemonSet.
    teamState.splicePokemonTeam(tabIdx, 1, Pokemon.importSet(preset));
  };

  return (
    <>
      <div className="carousel-center carousel rounded-box w-full bg-base-300 p-1">
        <div className="carousel-item w-full justify-around">
          {data.map((p, i) => (
            <div key={i} className="card w-52 bg-base-100 shadow-xl lg:w-60 xl:w-80">
              <div className="card-body p-1 lg:p-2">
                <h6 className="card-title overflow-ellipsis text-xs tracking-tight">
                  From [{p.title}] by {p.author}
                </h6>
                <pre className="h-40 whitespace-pre-wrap text-xs leading-tight tracking-tighter">{p.paste}</pre>
                <div className="card-actions justify-end">
                  <Link href={`/pastes/vgc/${p._id}/`} passHref>
                    <a role="button" className="btn-secondary btn-xs btn lg:btn-sm" target="_blank">
                      Show team
                    </a>
                  </Link>
                  <button type="button" className="btn-primary btn-xs btn lg:btn-sm" onClick={() => handlePresetClick(p.paste)}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center">
        <div className="btn-group">
          <button className="btn-sm btn" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex <= 1}>
            ←
          </button>
          <button className="btn-sm btn">Page {pageIndex}</button>
          <button className="btn-sm btn" onClick={() => setPageIndex(pageIndex + 1)} disabled={data.length < pageSize}>
            →
          </button>
        </div>
      </div>
    </>
  );
};
