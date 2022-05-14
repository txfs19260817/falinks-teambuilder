import { DocumentDownloadIcon, LinkIcon, PaperAirplaneIcon, UploadIcon } from '@heroicons/react/solid';
import { useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/StoreContext';
import { Pokemon } from '@/models/Pokemon';

function ImportDialog() {
  const { teamState } = useContext(StoreContext);

  const importTextarea = useRef<HTMLTextAreaElement>(null);

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

  const loadExampleHandler = () => {
    if (importTextarea.current) {
      importTextarea.current.value = exampleText;
    }
  };

  const importHandler = () => {
    const newTeam = Pokemon.convertPasteToTeam(importTextarea.current?.value ?? '');
    if (newTeam) {
      teamState.team.splice(0, teamState.team.length, ...newTeam);
    } else {
      toast.error('Invalid paste');
    }
    // clear the textarea
    if (importTextarea.current) {
      importTextarea.current.value = '';
    }
  };

  return (
    <>
      <label htmlFor="import-ps-modal" className="modal-button btn btn-sm rounded-none md:btn-md" title="Import a team from Showdown paste">
        <UploadIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span className="hidden md:inline-block">Import</span>
      </label>
      <input type="checkbox" id="import-ps-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Please leave your Showdown paste here ↓</h3>
          <textarea className="textarea-secondary textarea w-full" ref={importTextarea}></textarea>
          <div className="modal-action">
            <button className="btn btn-secondary" onClick={loadExampleHandler}>
              Load Example
            </button>
            <label htmlFor="import-ps-modal" className="btn btn-primary" onClick={importHandler}>
              Import
            </label>
            <label htmlFor="import-ps-modal" className="btn">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function ExportDialog() {
  const { teamState } = useContext(StoreContext);

  const exportTextarea = useRef<HTMLTextAreaElement>(null);

  const exportHandler = () => {
    navigator.clipboard
      .writeText(exportTextarea.current?.value ?? '')
      .then(() => {
        toast.success('📋 Copied!');
      })
      .catch((e) => {
        toast.error(`Failed to copy: ${e.message}`);
      });
  };

  return (
    <>
      <label htmlFor="export-ps-modal" className="modal-button btn btn-sm rounded-none md:btn-md" title="Export a team to Showdown paste">
        <DocumentDownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span className="hidden md:inline-block">Export</span>
      </label>
      <input type="checkbox" id="export-ps-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Exported Showdown paste here ↓</h3>
          <textarea
            className="textarea-secondary textarea w-full"
            readOnly={true}
            ref={exportTextarea}
            value={Pokemon.convertTeamToPaste(teamState.team)}
          ></textarea>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={exportHandler}>
              Copy
            </button>
            <label htmlFor="export-ps-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function CopyLink() {
  return (
    <button
      className="btn btn-sm md:btn-md"
      title="Copy the current room link to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href).then(() => toast('📋 Copied!'));
      }}
    >
      <LinkIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span className="hidden md:inline-block">Copy Link</span>
    </button>
  );
}

function PostPokepaste() {
  const { teamState } = useContext(StoreContext);
  return (
    <form className="inline" method="post" action="https://pokepast.es/create" target="_blank">
      <input type="hidden" name="title" value="egtitle" />
      <input type="hidden" name="paste" value={Pokemon.convertTeamToPaste(teamState.team)} />
      <input type="hidden" name="author" value="egauthor" />
      <input type="hidden" name="notes" value="egnotes" />
      <button type="submit" className="btn btn-sm md:btn-md" title="Upload the current team to PokéPaste">
        <PaperAirplaneIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span className="hidden md:inline-block">PokéPaste</span>
      </button>
    </form>
  );
}

function Menu() {
  return (
    <div className="btn-group">
      <CopyLink />
      <ExportDialog />
      <ImportDialog />
      <PostPokepaste />
    </div>
  );
}

export default Menu;
