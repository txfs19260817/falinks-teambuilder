import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';

export function PostPokepasteDialog() {
  const { teamState } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const { register, setValue, getValues } = useForm<PokePaste>();

  useEffect(() => {
    // @ts-ignore
    setValue('author', (teamState.metadata.authors?.toJSON() || []).join(', '));
    setValue('notes', teamState.metadata.notes ?? '');
    setValue('paste', Pokemon.convertTeamToPaste(teamState.team));
    setValue('title', teamState.metadata.roomName || 'Falinks-teambuilder');
  }, [isOpen]);

  const handleSubmitToFalinks = () => {
    const promise = fetch('/api/pastes/create', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getValues()),
    });
    toast
      .promise(promise, {
        loading: 'Creating Paste...',
        success: 'Paste Created! Being show you in a new window...',
        error: (e) => `Error when creating your paste: ${e}`,
      })
      .then((r) => {
        if (r.url) {
          window.open(r.url, '_blank');
        }
      });
  };

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
          <div className="modal-action flex-col justify-center md:flex-row">
            <span className="hidden" />
            <button type="submit" className="btn-secondary btn-sm btn my-1">
              To PokéPaste
            </button>
            <button type="button" className="btn-secondary btn-sm btn my-1" onClick={handleSubmitToFalinks}>
              To Falinks Teambuilder
            </button>
            <label htmlFor="post-pokepaste-modal" className="btn-sm btn my-1">
              Cancel
            </label>
          </div>
        </form>
      </div>
    </>
  );
}
