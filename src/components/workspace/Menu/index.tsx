import { DocumentDownloadIcon, LinkIcon, PaperAirplaneIcon, UploadIcon } from '@heroicons/react/solid';
import { useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/StoreContext';
import { Pokemon } from '@/models/Pokemon';

function Menu() {
  const { teamState } = useContext(StoreContext);

  const importTextarea = useRef<HTMLTextAreaElement>(null);

  const importHandler = () => {
    const text = importTextarea.current?.value ?? '';
    const newTeam = Pokemon.convertPasteToTeam(text);
    if (newTeam) {
      teamState.team.splice(0, teamState.team.length, ...newTeam);
    }
  };

  return (
    <>
      {/* Menu */}
      <div className="btn-group">
        <button className="btn btn-sm md:btn-md" title="Export this team" onClick={() => Pokemon.convertTeamToPaste(teamState.team)}>
          <DocumentDownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="hidden md:inline-block">Export</span>
        </button>
        <label htmlFor="import-ps-modal" className="modal-button btn btn-sm rounded-none md:btn-md" title="Import a team">
          <UploadIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="hidden md:inline-block">Import</span>
        </label>
        <button className="btn btn-sm md:btn-md" title="Upload the current team to PokéPaste">
          <PaperAirplaneIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="hidden md:inline-block">PokéPaste</span>
        </button>
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
      </div>
      {/* Import textarea */}
      <input type="checkbox" id="import-ps-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Please leave your Showdown paste here ↓</h3>
          <textarea name="paste" className="textarea-secondary textarea w-full" ref={importTextarea}></textarea>
          <div className="modal-action">
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

export default Menu;
