import { Specie } from '@pkmn/data';
import { Row } from '@tanstack/react-table';
import Link from 'next/link';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import Loading from '@/templates/Loading';

type Data = {
  id: string;
  paste: string;
  title: string;
  author: string;
};

const pageSize = 5;

const Paginator = ({ page, setPage, disableNext }: { page: number; setPage: (page: number) => void; disableNext: boolean }) => {
  return (
    <div className="flex justify-center">
      <div className="btn-group">
        <button className="btn-sm btn" onClick={() => setPage(1)} disabled={page <= 1}>
          «
        </button>
        <button className="btn-sm btn" onClick={() => setPage(page - 1)} disabled={page <= 1}>
          ←
        </button>
        <button className="btn-sm btn">Page {page}</button>
        <button className="btn-sm btn" onClick={() => setPage(page + 1)} disabled={disableNext}>
          →
        </button>
      </div>
    </div>
  );
};

export const PresetsSubComponent = (row: Row<Specie>) => {
  const { tabIdx, teamState } = useContext(StoreContext);
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error } = useSWR<Data[]>(`/api/usages/presets/${row.original.name}?page=${pageIndex}&format=${teamState.format}`, (u) =>
    fetch(u).then((r) => r.json())
  );
  if (!data) {
    return <Loading />;
  }
  const handlePresetClick = (preset: string) => {
    // replace current team with `preset` which is a PokemonSet.
    teamState.splicePokemonTeam(tabIdx, 1, Pokemon.importSet(preset));
  };

  return (
    <>
      {error || (Array.isArray(data) && data.length === 0) ? (
        <div className="w-full text-center">No Preset found, please try to change the format to check out more presets.</div>
      ) : (
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
                    <Link href={`/pastes/vgc/${p.id}/`} passHref>
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
      )}
      {/* Pagination */}
      <Paginator page={pageIndex} setPage={setPageIndex} disableNext={data.length < pageSize} />
    </>
  );
};
