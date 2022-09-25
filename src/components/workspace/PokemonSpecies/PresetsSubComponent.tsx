import { Specie } from '@pkmn/data';
import { Row } from '@tanstack/react-table';
import { Fragment, useContext, useState } from 'react';
import useSWR from 'swr';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import Loading from '@/templates/Loading';

const pageSize = 5;

export const PresetsSubComponent = (row: Row<Specie>) => {
  const { tabIdx, teamState } = useContext(StoreContext);
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error } = useSWR<PokePaste[]>(`/api/usages/presets/${row.original.name}?page=${pageIndex}`, (url) => fetch(url).then((r) => r.json()));
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
        <div className="carousel-item w-full">
          {data.map((p, i) => (
            <Fragment key={i}>
              <pre
                title="Click to load this set"
                className="rounded-box m-1 w-1/5 cursor-pointer whitespace-pre-wrap border border-neutral bg-base-100 p-1 text-xs leading-tight tracking-tighter hover:border-primary hover:shadow-2xl"
                onClick={() => handlePresetClick(p.paste)}
              >
                <h6 className="text-base-content/50">{`/* From ${p.title} by ${p.author} */\n`}</h6>
                {p.paste}
              </pre>
            </Fragment>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center">
        <div className="btn-group">
          <button className="btn-xs btn" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex <= 1}>
            «
          </button>
          <button className="btn-xs btn">Page {pageIndex}</button>
          <button className="btn-xs btn" onClick={() => setPageIndex(pageIndex + 1)} disabled={data.length < pageSize}>
            »
          </button>
        </div>
      </div>
    </>
  );
};
