import { Icons } from '@pkmn/img';
import Image from 'next/image';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import SpriteAvatar from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';

export function OverviewTabBtn() {
  const { tabIdx, setTabIdx } = useContext(StoreContext);
  return (
    <button className={`tab tab-lifted tab-md md:tab-lg ${tabIdx === -1 ? 'tab-active' : 'text-info-content bg-info'}`} onClick={() => setTabIdx(-1)}>
      Overview
    </button>
  );
}

function TeamTypeChart() {
  const { gen } = useContext(DexContext);
  const { teamState } = useContext(StoreContext);
  const teamTypeChart = teamState.getTeamTypeChart(gen);

  return (
    <table className="table-zebra table-compact table w-full p-2">
      <thead>
        <tr>
          <th>Type</th>
          {[0, 0.25, 0.5, 1, 2, 4].map((multiplier) => (
            <th key={multiplier}>{multiplier}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(gen.types).map(({ name }) => (
          <tr key={name}>
            <td>
              <Image className="inline-block" width={32} height={14} key={name} alt={name} title={name} src={Icons.getType(name).url} loading="lazy" />
            </td>
            {['0', '0.25', '0.5', '1', '2', '4'].map((multiplier) => {
              const speciesIDs = teamTypeChart.get(name)![multiplier as '0' | '0.25' | '0.5' | '1' | '2' | '4'].map((s) => s.id);
              return (
                <td key={multiplier}>
                  {speciesIDs.map((id) => (
                    <span key={id} style={Icons.getPokemon(id).css} />
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Overview() {
  const { teamState, setTabIdx } = useContext(StoreContext);

  return (
    <div className="mockup-window border bg-base-300">
      <div className="grid grid-cols-2 gap-2 px-2">
        <select
          className="select-bordered select select-sm w-full md:select-md"
          title="Format"
          value={teamState.format}
          onChange={(e) => {
            teamState.format = (e.target as HTMLSelectElement).value;
          }}
        >
          <option disabled={true}>Format</option>
          {AppConfig.formats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
        <input
          className="input-bordered input input-sm w-full md:input-md"
          type="text"
          title="Team title"
          placeholder="Team title"
          value={teamState.title}
          onChange={(e) => {
            teamState.title = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div className="grid gap-y-2 gap-x-2 bg-base-200 py-2 px-1 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const pm = teamState.getPokemonInTeam(i);
          const pmPaste: string = pm ? Pokemon.exportSetToPaste(pm) : '';

          return (
            <div key={i} className="card bg-base-100 pt-4 shadow-xl">
              <SpriteAvatar idx={i} />
              {!pm ? (
                <div className="card-body">
                  <h2 className="card-title">Nothing</h2>
                  <p>but a substitute.</p>
                </div>
              ) : (
                <div className="card-body py-1 px-4">
                  <pre className="whitespace-pre-wrap leading-5 tracking-tighter">{pmPaste}</pre>
                  <div className="card-actions justify-end">
                    <button
                      className="btn-primary btn-sm btn"
                      onClick={() => {
                        setTabIdx(i);
                      }}
                    >
                      Switch to this tab
                    </button>
                    <button
                      className="btn-secondary btn-sm btn"
                      onClick={() => {
                        navigator.clipboard.writeText(pmPaste).then(() => toast('📋 Copied!'));
                      }}
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <TeamTypeChart />
    </div>
  );
}

export default Overview;
