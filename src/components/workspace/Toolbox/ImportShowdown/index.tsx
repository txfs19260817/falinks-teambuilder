import { useTranslation } from 'next-i18next';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { isValidPokePasteURL } from '@/utils/PokemonUtils';

const exampleText = `Dog (Zacian-Crowned) @ Rusted Sword  
Ability: Intrepid Sword  
Level: 50  
EVs: 252 Atk / 4 SpD / 252 Spe  
Jolly Nature  
- Behemoth Blade  
- Play Rough  
- Sacred Sword  
- Protect  

Groudon @ Assault Vest  
Ability: Drought  
Level: 50  
EVs: 164 HP / 228 Atk / 4 Def / 100 SpD / 12 Spe  
Adamant Nature  
- Precipice Blades  
- Fire Punch  
- Stone Edge  
- Heavy Slam  

Incineroar @ Shuca Berry  
Ability: Intimidate  
Level: 50  
EVs: 252 HP / 4 Atk / 84 Def / 156 SpD / 12 Spe  
Careful Nature  
- Fake Out  
- Throat Chop  
- Flare Blitz  
- Parting Shot  

Charizard-Gmax @ Life Orb  
Ability: Solar Power  
Level: 50  
EVs: 252 SpA / 4 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Blast Burn  
- Heat Wave  
- Hurricane  
- Protect  

Gastrodon @ Leftovers  
Ability: Storm Drain  
Level: 50  
EVs: 180 HP / 204 Def / 124 SpD  
Bold Nature  
IVs: 0 Atk  
- Earth Power  
- Ice Beam  
- Protect  
- Yawn  

Grimmsnarl (M) @ Light Clay  
Ability: Prankster  
Level: 50  
EVs: 252 HP / 4 Atk / 116 Def / 124 SpD / 12 Spe  
Impish Nature  
- Spirit Break  
- Light Screen  
- Reflect  
- Scary Face  
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
