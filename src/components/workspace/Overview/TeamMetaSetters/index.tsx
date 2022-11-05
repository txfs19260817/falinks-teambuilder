import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

export function TeamMetaSetters() {
  const { teamState } = useContext(StoreContext);
  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      <select
        className="select-bordered select select-sm w-full md:select-md"
        title="Format"
        value={teamState.format}
        onChange={(e) => {
          teamState.format = (e.target as HTMLSelectElement).value;
        }}
      >
        <option disabled={true}>Format</option>
        {AppConfig.formats.map((format) => (
          <option key={format} value={format}>
            {format}
          </option>
        ))}
      </select>
      <input
        className="input-bordered input input-sm w-full md:input-md"
        type="text"
        title="Team title"
        placeholder="Team title"
        value={teamState.title}
        onChange={(e) => {
          teamState.title = (e.target as HTMLInputElement).value;
        }}
      />
    </div>
  );
}
