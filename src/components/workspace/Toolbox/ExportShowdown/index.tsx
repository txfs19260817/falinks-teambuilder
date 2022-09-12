import { DocumentDownloadIcon } from '@heroicons/react/solid';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';

export function ExportShowdownDialog() {
  const { teamState } = useContext(StoreContext);
  const exportTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const exportHandler = () => {
    navigator.clipboard
      .writeText(exportTextareaRef.current?.value ?? '')
      .then(() => {
        toast.success('📋 Copied!');
      })
      .catch((e) => {
        toast.error(`Failed to copy: ${e.message}`);
      });
  };

  // lazy load showdown
  useEffect(() => {
    if (isOpen && exportTextareaRef.current && teamState.team.length > 0) {
      exportTextareaRef.current.value = Pokemon.convertTeamToPaste(teamState.team);
    }
  }, [isOpen]);

  return (
    <>
      <input
        type="checkbox"
        id="export-ps-modal"
        className="modal-toggle"
        onChange={(e) => {
          setIsOpen(e.target.checked);
        }}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Exported Showdown paste here ↓</h3>
          <textarea className="textarea-secondary textarea w-full" rows={10} readOnly={true} ref={exportTextareaRef}></textarea>
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

function ExportShowdown() {
  return (
    <label htmlFor="export-ps-modal" className="modal-button rounded" title="Export this team to Showdown paste">
      <DocumentDownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span>Export</span>
    </label>
  );
}

export default ExportShowdown;
