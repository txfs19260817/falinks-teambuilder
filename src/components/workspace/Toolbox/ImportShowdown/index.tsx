import { useTranslation } from 'next-i18next';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { isValidPokePasteURL } from '@/utils/PokemonUtils';

const exampleText = `Dondozo (F) @ Leftovers  
Ability: Oblivious  
Level: 50  
Tera Type: Dragon  
EVs: 252 Atk / 4 SpD / 252 Spe  
Jolly Nature  
- Order Up  
- Substitute  
- Earthquake  
- Protect  

Tatsugiri (F) @ Choice Scarf  
Ability: Commander  
Level: 50  
Tera Type: Rock  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Muddy Water  
- Dragon Pulse  
- Icy Wind  
- Helping Hand  

Arcanine (F) @ Wide Lens  
Ability: Intimidate  
Level: 50  
EVs: 244 HP / 4 Def / 4 SpA / 4 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Heat Wave  
- Will-O-Wisp  
- Snarl  
- Protect  

Glimmora (M) @ Light Clay  
Ability: Toxic Debris  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Light Screen  
- Power Gem  
- Reflect  
- Sludge Wave  

Dragonite (M) @ Choice Band  
Ability: Inner Focus  
Level: 50  
Tera Type: Normal  
EVs: 244 HP / 252 Atk / 4 Def / 4 SpD / 4 Spe  
Adamant Nature  
- Extreme Speed  
- Fire Punch  
- Iron Head  
- Aerial Ace  

Tinkaton @ Metal Coat  
Ability: Own Tempo  
Level: 50  
Tera Type: Steel  
EVs: 4 HP / 252 Atk / 252 Spe  
Adamant Nature  
- Play Rough  
- Fake Out  
- Gigaton Hammer  
- Protect   
`;

export function ImportShowdownDialog() {
  const { t } = useTranslation();
  const { teamState, tabIdx } = useContext(StoreContext);
  const [single, setSingle] = useState(false);

  const importTextareaRef = useRef<HTMLTextAreaElement>(null);

  const loadExampleHandler = () => {
    if (importTextareaRef.current) {
      importTextareaRef.current.value = exampleText;
    }
  };

  const singleSetHandler = () => {
    setSingle(!single);
  };

  const importHandler = () => {
    const text = importTextareaRef.current?.value ?? '';
    // clear the textarea
    if (importTextareaRef.current) {
      importTextareaRef.current.value = '';
    }
    // check if it's a PokePaste link
    if (isValidPokePasteURL(text)) {
      Pokemon.pokePasteURLFetcher(text)
        .then((data) => {
          const newTeam = Pokemon.convertPasteToTeam(data.paste);
          if (!newTeam) {
            toast.error(t('room.invalidPasteFromPokePaste'));
            return;
          }
          teamState.splicePokemonTeam(0, teamState.teamLength, ...newTeam);
        })
        .catch((err) => {
          toast.error(`${t('room.invalidPasteFromPokePaste')}: ${err}`);
        });
      return;
    }
    // check if it's a single set
    if (single) {
      if (teamState.teamLength === 0) {
        toast.error(t('room.noPokemonInTeam'));
        return;
      }
      const newMon = Pokemon.importSet(text);
      if (!newMon) {
        toast.error(t('room.invalidPaste'));
        return;
      }
      teamState.splicePokemonTeam(tabIdx, 1, newMon);
    } else {
      // it's a team paste
      const newTeam = Pokemon.convertPasteToTeam(text);
      if (!newTeam) {
        toast.error(t('room.invalidPaste'));
        return;
      }
      teamState.splicePokemonTeam(0, teamState.teamLength, ...newTeam);
    }
  };
  return (
    <>
      <input type="checkbox" id={AppConfig.toolboxIDs.importModal} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label htmlFor={AppConfig.toolboxIDs.importModal} className="btn-sm btn-circle btn absolute right-2 top-2">
            ✕
          </label>
          <h3 className="font-bold md:text-lg">{t('room.toolbox.import-ps-modal.title')}</h3>
          <textarea className="textarea-secondary textarea w-full" rows={10} ref={importTextareaRef}></textarea>
          {tabIdx >= 0 && tabIdx < teamState.teamLength && (
            <label className="label cursor-pointer">
              <span className="label-text">{t('room.toolbox.import-ps-modal.single')}</span>
              <input type="checkbox" className="checkbox" checked={single} onChange={singleSetHandler} />
            </label>
          )}
          <div className="modal-action">
            <button className="btn-secondary btn-sm btn" onClick={loadExampleHandler}>
              {t('room.toolbox.import-ps-modal.loadExample')}
            </button>
            <label htmlFor={AppConfig.toolboxIDs.importModal} className="btn-primary btn-sm btn" onClick={importHandler}>
              {t('room.toolbox.import-ps-modal.import')}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
