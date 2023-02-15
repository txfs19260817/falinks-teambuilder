import { useTranslation } from 'next-i18next';
import { ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
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
      <label tabIndex={idx} className="indicator-item badge-secondary badge">
        ≡
      </label>
      <div tabIndex={idx} className="dropdown-content card card-compact w-full bg-base-200 p-1 shadow md:w-96">
        <div className="card-body">
          <h1 className="card-title">{t(getPokemonTranslationKey(pm.species, 'species'))}</h1>
          <textarea ref={pasteTextareaRef} className="textarea" placeholder="..." rows={10}></textarea>
          <div className="card-actions">
            <button className="btn-primary btn-xs btn" onClick={() => updateTab(idx)}>
              {t('common.update')}
            </button>
            <button
              className="btn-accent btn-xs btn"
              onClick={() => {
                navigator.clipboard.writeText(pasteTextareaRef.current?.value || '').then(() => toast(t('common.copiedToClipboard')));
              }}
            >
              {t('common.copy')}
            </button>
            <button className="btn-error btn-xs btn" onClick={() => removeTab(idx)}>
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
  const { teamState, tabIdx, setTabIdx, focusedFieldDispatch } = useContext(StoreContext);

  const formatToSpecies = useMemo(
    () =>
      new Map([
        // gen 1
        ['gen1ou', 'Tauros'],
        ['gen1uu', 'Dragonite'],
        // gen 2
        ['gen2ou', 'Raikou'],
        ['gen2uu', 'Granbull'],
        // gen 3
        ['gen3ou', 'Metagross'],
        ['gen3uu', 'Altaria'],
        // gen 4
        ['gen4ou', 'Heatran'],
        ['gen4zu', 'Probopass'],
        // gen 5
        ['gen5ou', 'Jellicent'],
        // gen 6
        ['gen6ou', 'Talonflame'],
        ['gen6doublesou', 'Volcanion'],
        ['vgc2014', 'Pachirisu'],
        ['vgc2015', 'Landorus-Therian'],
        ['gen6vgc2016', 'Xerneas'],
        // gen 7
        ['gen7ou', 'Tapu Koko'],
        ['gen7doublesou', 'Incineroar'],
        ['gen7ubers', 'Yveltal'],
        ['gen7mixandmega', 'Kartana'],
        ['gen7vgc2017', 'Tapu Fini'],
        ['gen7vgc2018', 'Incineroar'],
        ['gen7vgc2019ultraseries', 'Incineroar'],
        // gen 8
        ['gen8ou', 'Dragapult'],
        ['gen8uu', 'Cobalion'],
        ['gen8doublesou', 'Rillaboom'],
        ['gen8battlestadiumsingles', 'Gastrodon'],
        ['gen8bdspou', 'Garchomp'],
        ['gen8nationaldex', 'Ferrothorn'],
        ['gen8vgc2022', 'Incineroar'],
        ['gen8spikemuthcup', 'gen8spikemuthcup'],
        // gen 9
        ['gen9ou', 'Gholdengo'],
        ['gen9doublesou', 'Gholdengo'],
        ['gen9battlestadiumsinglesseries1', 'Gholdengo'],
        ['gen9battlestadiumsinglesseries2', 'Gholdengo'],
        ['gen9vgc2023series1', 'Gholdengo'],
        ['gen9vgc2023series2', 'Flutter Mane'],
      ]),
    []
  );

  const newDefaultMon = useCallback(() => {
    const newMon = new Pokemon(formatToSpecies.get(teamState.format) ?? 'Pikachu');
    newMon.level = teamState.format.includes('vgc') ? 50 : 100; // VGC format starts at level 50, otherwise 100
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
    <div role="tablist" className="tabs tabs-boxed">
      {children}
      {teamState.team.map((p, i) => (
        <div key={p.id} className="dropdown-right dropdown indicator">
          {/* indicator */}
          <TabMenu idx={i} />
          {/* tab */}
          <a
            role="tab"
            aria-label={`Tab ${i + 1}`}
            className={`tab tab-lifted tab-md md:tab-lg ${i === tabIdx ? 'tab-active' : ''}`}
            onClick={() => setTabIdx(i)}
          >
            <span className="text-sm">{i + 1}</span>
            <PokemonIcon speciesId={p.species} />
            <span>{t(getPokemonTranslationKey(p.species, 'species'))}</span>
          </a>
        </div>
      ))}
      {/* Show Plus sign following all tabs until there are 6 Pokémon */}
      {teamState.teamLength < AppConfig.maxPokemonPerTeam && (
        // Show tooltip if no Pokémon in team
        <div className={`tooltip-right tooltip-secondary ${teamState.teamLength === 0 ? 'tooltip-open tooltip' : ''}`} data-tip={t('room.addFirstPm')}>
          <button className="tab tab-lifted tab-active tab-md md:tab-lg" onClick={() => newTab()} role="tab" aria-label="Add new tab">
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default TabsSwitcher;
