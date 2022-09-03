import { ClipboardCopyIcon } from '@heroicons/react/solid';
import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import SpriteAvatar from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';

export function OverviewTabBtn() {
  const { tabIdx, setTabIdx } = useContext(StoreContext);
  return (
    <button className={`tab tab-lifted tab-md md:tab-lg ${tabIdx === -1 ? 'tab-active' : 'text-info-content bg-info'}`} onClick={() => setTabIdx(-1)}>
      Overview
    </button>
  );
}

function Overview() {
  const { teamState } = useContext(StoreContext);

  return (
    <div className="mockup-window border bg-base-300">
      <div className="grid grid-cols-3 grid-rows-2 gap-y-2 gap-x-2 bg-base-200 py-2 px-1">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const pm = teamState.team[i];
          const pmPaste: string = pm ? Pokemon.exportSetToPaste(pm) : '';

          return (
            <div key={i} className="card bg-base-100 shadow-xl lg:card-side">
              <SpriteAvatar idx={i} />
              {!pm ? (
                <div className="card-body">
                  <h2 className="card-title">Nothing</h2>
                  <p>but a substitute.</p>
                </div>
              ) : (
                <div className="card-body">
                  <pre className="whitespace-pre-wrap">{pmPaste}</pre>
                  <div className="card-actions justify-self-end">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(pmPaste).then(() => toast('📋 Copied!'));
                      }}
                    >
                      <ClipboardCopyIcon className="h-4 w-4" />
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
