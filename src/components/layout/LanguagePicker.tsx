import { useRouter } from 'next/router';
import { ChangeEventHandler } from 'react';

type LanguagePickerProps = {
  className?: string;
};

export const LanguagePicker = ({ className = 'bg-neutral text-neutral-content w-xs md:w-sm select-xs md:select-sm' }: LanguagePickerProps) => {
  const { push, locale, asPath } = useRouter();
  const localeMap: Record<string, { name: string; ariaLabel: string }> = {
    en: { name: 'English', ariaLabel: 'Choose language' },
    'zh-Hans': { name: '简体中文', ariaLabel: '选择语言' },
    'zh-Hant': { name: '繁體中文', ariaLabel: '選擇語言' },
    de: { name: 'Deutsch', ariaLabel: 'Wähle eine Sprache' },
    es: { name: 'Español', ariaLabel: 'Elige un idioma' },
    fr: { name: 'Français', ariaLabel: 'Choisissez une langue' },
    it: { name: 'Italiano', ariaLabel: 'Scegli la lingua' },
    ja: { name: '日本語', ariaLabel: '言語を選択' },
    ko: { name: '한국어', ariaLabel: '언어 선택' },
  };
  const handleLanguageChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    push(asPath, asPath, { locale: e.target.value });
  };

  return (
    <select
      role="listbox"
      aria-label={localeMap[locale ?? 'en']?.ariaLabel ?? 'Choose language'}
      className={`select select-primary capitalize ${className}`}
      onChange={handleLanguageChange}
      defaultValue={locale}
    >
      {Object.entries(localeMap).map(([l, { name }]) => (
        <option key={l} value={l}>
          {name}
        </option>
      ))}
    </select>
  );
};
