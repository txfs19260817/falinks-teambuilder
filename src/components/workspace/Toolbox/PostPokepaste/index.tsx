import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';

export function PostPokepasteDialog() {
  const { teamState } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const { register, setValue } = useForm<PokePaste>();
  useEffect(() => {
    // @ts-ignore
    setValue('author', (teamState.metadata.authors?.toJSON() || []).join(', '));
    setValue('notes', teamState.metadata.notes ?? '');
    setValue('paste', Pokemon.convertTeamToPaste(teamState.team));
    setValue('title', teamState.metadata.roomName || 'Falinks-teambuilder');
  }, [isOpen]);

  return (
    <>
      <input
        type="checkbox"
        id="post-pokepaste-modal"
        className="modal-toggle"
        onChange={(e) => {
          setIsOpen(e.target.checked);
        }}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <form className="modal-box" method="post" action="https://pokepast.es/create" target="_blank">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input className="input-bordered input" type="text" {...register('title')} />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Author</span>
            </label>
            <input className="input-bordered input" type="text" {...register('author')} />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea className="textarea-secondary textarea w-full" {...register('notes')} />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Paste</span>
            </label>
            <textarea className="textarea-secondary textarea w-full" {...register('paste')} />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-secondary btn-sm">
              Submit
            </button>
            <label htmlFor="post-pokepaste-modal" className="btn btn-sm">
              Cancel
            </label>
          </div>
        </form>
      </div>
    </>
  );
}

function PostPokepaste() {
  return (
    <label htmlFor="post-pokepaste-modal" className="modal-button rounded" title="Import a team from Showdown paste">
      <PaperAirplaneIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span>PokéPaste</span>
    </label>
  );
}

export default PostPokepaste;
