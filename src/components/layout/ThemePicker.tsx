import { useEffect } from 'react';
import { themeChange } from 'theme-change';

import { AppConfig } from '@/utils/AppConfig';

type ThemePickerProps = {
  className?: string;
};

export const ThemePicker = ({ className = 'bg-neutral text-neutral-content w-xs md:w-sm select-xs md:select-sm' }: ThemePickerProps) => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <select className={`select select-primary capitalize ${className}`} data-choose-theme>
      {AppConfig.themes.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  );
};
