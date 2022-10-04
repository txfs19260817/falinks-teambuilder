import { ChangeEvent } from 'react';

import { AppConfig } from '@/utils/AppConfig';

export const FormatSelector = ({ format, handleChange }: { format: string; handleChange: (e: ChangeEvent<HTMLSelectElement>) => void }) => {
  return (
    <div className="input-group-xs input-group">
      <span>Format</span>
      <select className="select-bordered select select-sm w-48 overflow-ellipsis" defaultValue={format} onChange={handleChange}>
        {AppConfig.usageFormats.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
    </div>
  );
};
