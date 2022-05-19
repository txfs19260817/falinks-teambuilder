import { DocumentDownloadIcon } from '@heroicons/react/solid';
import { useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';

function ExportShowdown() {
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
      <label htmlFor="export-ps-modal" className="modal-button rounded" title="Export this team to Showdown paste">
        <DocumentDownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span>Export</span>
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
            <button className="btn btn-primary btn-sm" onClick={exportHandler}>
              Copy
            </button>
            <label htmlFor="export-ps-modal" className="btn btn-sm">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExportShowdown;
