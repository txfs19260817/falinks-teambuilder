import { Icons } from '@pkmn/img';
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

function TabMenu({ idx }: { idx: number }) {
  const { teamState, setTabIdx, tabIdx } = useContext(StoreContext);
  const pasteTextareaRef = useRef<HTMLTextAreaElement>(null);

  const removeTab = (index: number) => {
    const newTeam = teamState.team.splice(index, 1);
    if (newTeam.length === 0) {
      setTabIdx(-1);
    } else if (index === tabIdx) {
      setTabIdx(index - 1 >= 0 ? index - 1 : 0);
    }
  };

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
    teamState.team.splice(index, 1, newMon);
  };

  const pm = teamState.team[idx];
  useEffect(() => {
    if (pm && pasteTextareaRef.current) {
      pasteTextareaRef.current.value = Pokemon.exportSetToPaste(pm);
    }
  }, [pm, JSON.stringify(pm)]); // listen to any properties changes in this Pokémon
  if (!pm) return null;

  return (
    <>
      <label tabIndex={idx} className={`badge indicator-item badge-secondary`}>
        ≡
      </label>
      <div tabIndex={idx} className="card dropdown-content card-compact w-full bg-base-200 p-1 shadow md:w-64">
        <div className="card-body">
          <h1 className="card-title">{pm.species}</h1>
          <textarea ref={pasteTextareaRef} className="textarea" placeholder="Paste" rows={12}></textarea>
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
    const newLen = teamState.team.push(new Pokemon('Incineroar'));
    setTabIdx(newLen - 1);
    focusedFieldDispatch({
      type: 'set',
      payload: {
        Species: 0,
      },
    });
  };

  return (
    <div className="tabs tabs-boxed">
      {children}
      {teamState.team.map((p, i) => (
        <div key={p.id} className="dropdown-right dropdown indicator">
          <TabMenu idx={i} />
          <a className={`tab tab-lifted tab-md md:tab-lg ${i === tabIdx ? 'tab-active' : ''}`} onClick={() => setTabIdx(i)}>
            <span style={convertStylesStringToObject(Icons.getPokemon(p.species).style)} />
            <span>{p.species}</span>
          </a>
        </div>
      ))}
      {teamState.team.length < AppConfig.maxPokemonPerTeam && (
        <div className={`tooltip-right tooltip-secondary ${teamState.team.length === 0 ? 'tooltip tooltip-open' : ''}`} data-tip="Add the first Pokémon">
          <button className="tab tab-lifted tab-active tab-md md:tab-lg" onClick={() => newTab()}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default TabsSwitcher;
