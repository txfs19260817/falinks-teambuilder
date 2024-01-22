import { useTranslation } from 'next-i18next';
import { ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

// TabMenu is a component for each tab to update or remove the Pokémon.
function TabMenu({ idx }: { idx: number }) {
  const { t } = useTranslation(['common', 'room', 'species']);
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
      toast.error(t('room.invalidPaste'));
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
      <label tabIndex={idx} role="button" className="badge indicator-item badge-secondary">
        ≡
      </label>
      <div tabIndex={idx} className="card dropdown-content compact z-[1] w-full bg-base-200 text-base-content shadow md:w-80">
        <div className="card-body">
          <h2 className="card-title">{t(getPokemonTranslationKey(pm.species, 'species'))}</h2>
          <textarea ref={pasteTextareaRef} className="textarea" placeholder="..." rows={10}></textarea>
          <div className="card-actions">
            <button className="btn btn-primary btn-xs" onClick={() => updateTab(idx)}>
              {t('common.update')}
            </button>
            <button
              className="btn btn-accent btn-xs"
              onClick={() => {
                navigator.clipboard.writeText(pasteTextareaRef.current?.value || '').then(() => toast(t('common.copiedToClipboard')));
              }}
            >
              {t('common.copy')}
            </button>
            <button className="btn btn-error btn-xs" onClick={() => removeTab(idx)}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TabsSwitcher({ children }: { children?: ReactNode }) {
  const { t } = useTranslation(['common', 'room', 'species']);
  const { teamState, tabIdx, setTabIdx, focusedFieldDispatch, formatManager } = useContext(StoreContext);

  const newDefaultMon = useCallback(() => {
    const formatIdToSpeciesName = new Map(
      formatManager.getAllFormats().map((f) => {
        return [f.id, f.defaultSpeciesName];
      }),
    );
    const newMon = new Pokemon(formatIdToSpeciesName.get(teamState.format) ?? 'Pikachu');
    newMon.level = formatManager.getFormatById(teamState.format)?.defaultLevel ?? 100;
    return newMon;
  }, [teamState.format]);

  const newTab = () => {
    const newLen = teamState.addPokemonToTeam(newDefaultMon());
    setTabIdx(newLen - 1);
    focusedFieldDispatch({
      type: 'set',
      payload: {
        Species: 0,
      },
    });
  };

  return (
    <div role="tablist" className="tabs-boxed tabs tabs-md md:tabs-lg">
      {children}
      {teamState.team.map((p, i) => (
        <div
          key={p.id}
          role="tab"
          className={`tab dropdown dropdown-end dropdown-bottom ${i === tabIdx ? 'tab-active' : 'border border-x-2 border-secondary'} `}
        >
          {/* tab */}
          <a aria-label={`Tab ${i + 1}`} onClick={() => setTabIdx(i)} className={`indicator w-full`}>
            {/* indicator dropdown */}
            <TabMenu idx={i} />
            <span className="text-sm">{i + 1}</span>
            <PokemonIcon speciesId={p.species} />
            <span>{t(getPokemonTranslationKey(p.species, 'species'))}</span>
          </a>
        </div>
      ))}
      {/* Show Plus sign following all tabs until there are 6 Pokémon */}
      {teamState.teamLength < AppConfig.maxPokemonPerTeam && (
        // Show tooltip if no Pokémon in team
        <div
          className={`tab tooltip-right tooltip-secondary bg-accent text-info-content ${teamState.teamLength === 0 ? 'tooltip tooltip-open' : ''}`}
          data-tip={t('room.addFirstPm')}
          onClick={() => newTab()}
          role="tab"
          aria-label="Add a new tab"
        >
          +
        </div>
      )}
    </div>
  );
}

export default TabsSwitcher;
