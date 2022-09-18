import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';

const Create = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PokePaste>({
    defaultValues: {
      notes: '',
    },
  });

  const onSubmit = (data: PokePaste) => {
    const promise = fetch('/api/pastes/create', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    toast
      .promise(promise, {
        loading: 'Creating Paste...',
        success: 'Paste Created! Redirecting...',
        error: (e) => `Error when creating your paste: ${e}`,
      })
      .then((r) => {
        if (r.url) {
          window.location.href = r.url;
        }
      });
  };

  return (
    <Main title="Create Pastes">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="card my-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text after:text-error after:content-['_*']">Title</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                required={true}
                maxLength={50}
                className="input-bordered input text-base-content"
                {...register('title', {
                  required: true,
                })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="author">
                <span className="label-text after:text-error after:content-['_*']">Author Name</span>
              </label>
              <input
                id="author"
                type="text"
                placeholder="Author Name"
                required={true}
                maxLength={36}
                className="input-bordered input text-base-content"
                {...register('author', { required: true })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="paste">
                <span className="label-text after:text-error after:content-['_*']">Paste</span>
              </label>
              <textarea
                id="paste"
                className={`textarea-bordered textarea text-base-content ${errors.paste ? 'textarea-error' : ''}`}
                rows={9}
                {...register('paste', {
                  required: true,
                  validate: (value) => Pokemon.convertPasteToTeam(value) != null || 'Invalid paste',
                })}
              />
              {errors.paste && <p className="text-xs text-error-content">{errors.paste.message}</p>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="notes">
                <span className="label-text">Notes</span>
              </label>
              <textarea id="notes" className="textarea-bordered textarea" rows={3} {...register('notes')} />
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">Create Paste</button>
            </div>
          </form>
        </div>
      </div>
    </Main>
  );
};
export default Create;
