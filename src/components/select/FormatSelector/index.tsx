import { ChangeEvent } from 'react';

import { AppConfig } from '@/utils/AppConfig';

export const FormatSelector = ({
  defaultFormat,
  handleChange,
  formats = AppConfig.formats,
  inputGroup = true,
}: {
  defaultFormat: string;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  formats?: string[];
  inputGroup?: boolean;
}) => {
  if (inputGroup) {
    return (
      <div className="input-group-xs input-group">
        <span>Format</span>
        <select className="select-bordered select select-sm w-48 overflow-ellipsis" defaultValue={defaultFormat} onChange={handleChange}>
          {formats.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <select className="select-bordered select select-sm overflow-ellipsis" defaultValue={defaultFormat} onChange={handleChange}>
      {formats.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
};
