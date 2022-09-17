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
            <button className="btn-primary btn-sm btn" onClick={exportHandler}>
              Copy
            </button>
            <label htmlFor="export-ps-modal" className="btn-sm btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
