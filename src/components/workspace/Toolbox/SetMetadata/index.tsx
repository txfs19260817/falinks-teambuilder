import { InformationCircleIcon } from '@heroicons/react/solid';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Metadata } from '@/components/workspace/types';

export function SetMetadataDialog() {
  const { teamState } = useContext(StoreContext);
  const { register, handleSubmit, reset } = useForm<Metadata>({
    defaultValues: teamState.metadata,
  });

  useEffect(() => {
    reset(teamState.metadata);
  }, [teamState.metadata.title, teamState.metadata.author, teamState.metadata.notes]);

  return (
    <>
      <input type="checkbox" id="set-metadata-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <form
          className="modal-box"
          onSubmit={handleSubmit((data) => {
            teamState.metadata.title = data.title;
            teamState.metadata.author = data.author;
            teamState.metadata.notes = data.notes;
            toast.success('Your metadata has been updated');
          })}
        >
          <div className="form-control">
            <label htmlFor="title" className="text-sm">
              Title
            </label>
            <input id="title" className="input-secondary input" {...register('title')} />
          </div>
          <div className="form-control">
            <label htmlFor="author" className="text-sm">
              Author(s)
            </label>
            <input id="author" className="input-secondary input" {...register('author')} />
          </div>
          <div className="form-control">
            <label htmlFor="notes" className="text-sm">
              Notes
            </label>
            <input id="notes" className="input-secondary input" {...register('notes')} />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
            <label htmlFor="set-metadata-modal" className="btn btn-sm">
              Close
            </label>
          </div>
        </form>
      </div>
    </>
  );
}

function SetMetadata() {
  return (
    <label htmlFor="set-metadata-modal" className="rounded" title="Set author, title, and notes for the current team">
      <InformationCircleIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span>Set Metadata</span>
    </label>
  );
}

export default SetMetadata;
