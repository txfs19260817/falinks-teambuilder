import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';

// TabMenu is a component for each tab to update or remove the Pokémon.
function TabMenu({ idx }: { idx: number }) {
  const { teamState, setTabIdx, tabIdx } = useContext(StoreContext);
  const pasteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // remove tab, then set focus to the previous tab
  const removeTab = (index: number) => {
    const newTeam = teamState.splicePokemonTeam(index, 1);
    if (newTeam.length === 0) {
      setTabIdx(-1);
    } else if (index === tabIdx) {
      setTabIdx(index - 1 >= 0 ? index - 1 : 0);
    }
  };

  // replace current tab with a new Pokémon
  const updateTab = (index: number) => {
    const text = pasteTextareaRef.current?.value ?? '';
    if (pasteTextareaRef.current) {
      pasteTextareaRef.current.value = '';
    }
    const newMon = Pokemon.importSet(text);
    if (!newMon) {
      toast.error('Invalid set paste');
      return;
    }
    teamState.splicePokemonTeam(index, 1, newMon);
  };

  // listen to any properties changes in this Pokémon, including from other users
  const pm = teamState.getPokemonInTeam(idx);
  useEffect(() => {
    if (pm && pasteTextareaRef.current) {
      pasteTextareaRef.current.value = Pokemon.exportSetToPaste(pm);
    }
  }, [pm, JSON.stringify(pm)]);
  if (!pm) return null;

  return (
    <>
      <label tabIndex={idx} className="badge-secondary badge indicator-item">
        ≡
      </label>
      <div tabIndex={idx} className="card dropdown-content card-compact w-full bg-base-200 p-1 shadow md:w-96">
        <div className="card-body">
          <h1 className="card-title">{pm.species}</h1>
          <textarea ref={pasteTextareaRef} className="textarea" placeholder="Paste" rows={10}></textarea>
          <div className="card-actions">
            <button className="btn-primary btn-xs btn" onClick={() => updateTab(idx)}>
              Update
            </button>
            <button
              className="btn-accent btn-xs btn"
              onClick={() => {
                navigator.clipboard.writeText(pasteTextareaRef.current?.value || '').then(() => toast('📋 Copied!'));
              }}
            >
              Copy
            </button>
            <button className="btn-error btn-xs btn" onClick={() => removeTab(idx)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TabsSwitcher({ children }: { children?: ReactNode }) {
  const { teamState, tabIdx, setTabIdx, focusedFieldDispatch } = useContext(StoreContext);

  const newTab = () => {
    const newLen = teamState.addPokemonToTeam(new Pokemon('Incineroar'));
    setTabIdx(newLen - 1);
    focusedFieldDispatch({
      type: 'set',
      payload: {
        Species: 0,
      },
    });
  };

  return (
    <div role="tablist" className="tabs tabs-boxed">
      {children}
      {teamState.team.map((p, i) => (
        <div key={p.id} className="dropdown-right dropdown indicator">
          {/* indicator */}
          <TabMenu idx={i} />
          {/* tab */}
          <a role="tab" className={`tab tab-lifted tab-md md:tab-lg ${i === tabIdx ? 'tab-active' : ''}`} onClick={() => setTabIdx(i)}>
            <span className="text-sm">{i + 1}</span>
            <PokemonIcon speciesId={p.species} />
            <span>{p.species}</span>
          </a>
        </div>
      ))}
      {/* Show Plus sign following all tabs until there are 6 Pokémon */}
      {teamState.teamLength < AppConfig.maxPokemonPerTeam && (
        // Show tooltip if no Pokémon in team
        <div className={`tooltip-right tooltip-secondary ${teamState.teamLength === 0 ? 'tooltip tooltip-open' : ''}`} data-tip="Add the first Pokémon">
          <button className="tab tab-lifted tab-active tab-md md:tab-lg" onClick={() => newTab()}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default TabsSwitcher;
