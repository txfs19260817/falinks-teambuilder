import { Icons } from '@pkmn/img';
import React, { ReactNode, useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

function TabsSwitcher({ children }: { children?: ReactNode }) {
  const { teamState, tabIdx, setTabIdx, focusedFieldDispatch } = useContext(StoreContext);

  const newTab = () => {
    const newLen = teamState.team.push(new Pokemon('Bulbasaur'));
    setTabIdx(newLen - 1);
    focusedFieldDispatch({
      type: 'set',
      payload: {
        Species: 0,
      },
    });
  };

  const removeTab = (index: number) => {
    const newTeam = teamState.team.splice(index, 1);
    setTabIdx(newTeam.length - 1);
  };

  return (
    <div className="tabs tabs-boxed">
      {children}
      {teamState.team.map((p, i) => (
        <div key={p.id} className="indicator">
          <span className="badge indicator-item badge-secondary" onClick={() => removeTab(i)}>
            ×
          </span>
          <a className={`tab tab-lifted tab-md md:tab-lg ${i === tabIdx ? 'tab-active' : ''}`} onClick={() => setTabIdx(i)}>
            <span style={convertStylesStringToObject(Icons.getPokemon(p.species).style)}></span>
            {p.species}
          </a>
        </div>
      ))}
      {teamState.team.length < AppConfig.maxPokemonPerTeam && (
        <button className="tab tab-lifted tab-active tab-md md:tab-lg" onClick={() => newTab()}>
          +
        </button>
      )}
    </div>
  );
}

export default TabsSwitcher;
