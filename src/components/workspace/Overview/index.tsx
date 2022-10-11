import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';

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
    </div>
  );
}

export default Overview;
