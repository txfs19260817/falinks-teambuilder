import { InformationCircleIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';

function SetMetadata() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      author: '',
      notes: '',
    },
  });

  return (
    <>
      <label htmlFor="set-metadata-modal" className="rounded" title="Set author, title, and notes for the current team">
        <InformationCircleIcon className="h-4 w-4 md:h-6 md:w-6" />
        <span>Metadata</span>
      </label>
      <input type="checkbox" id="set-metadata-modal" className="modal-toggle" />
      <div className="modal modal-bottom rounded sm:modal-middle">
        <form
          className="modal-box"
          onSubmit={handleSubmit((data) => {
            alert(JSON.stringify(data)); // todo: set metadata
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

export default SetMetadata;
