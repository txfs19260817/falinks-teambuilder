import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Metadata } from '@/models/TeamState';
import { AppConfig } from '@/utils/AppConfig';

export function MetadataDialog() {
  const { teamState } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const { register, setValue, handleSubmit } = useForm<Metadata>();

  useEffect(() => {
    setValue('title', teamState.title);
    setValue('format', teamState.format);
  }, [isOpen]);

  const handleUpdate = (data: Partial<Metadata>) => {
    teamState.title = data.title || teamState.title;
    teamState.format = data.format || teamState.format;
    setIsOpen(false);
  };

  return (
    <>
      <input
        type="checkbox"
        id={`${AppConfig.toolboxIDs.metadataModal}-btn`}
        className="modal-toggle"
        onChange={(e) => {
          setIsOpen(e.target.checked);
        }}
        checked={isOpen}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <form
          className="modal-box"
          onSubmit={handleSubmit((data) => {
            handleUpdate(data);
          })}
        >
          <label htmlFor={AppConfig.toolboxIDs.metadataModal} className="btn-sm btn-circle btn absolute right-2 top-2">
            ✕
          </label>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input className="input-bordered input" type="text" {...register('title', { required: true })} />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Format</span>
            </label>
            <select className="input-bordered input" {...register('format', { required: true })}>
              {AppConfig.formats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn-primary btn-sm btn my-1">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
