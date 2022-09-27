import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ChangeEventHandler, useEffect } from 'react';
import { themeChange } from 'theme-change';

import { AppConfig } from '@/utils/AppConfig';

const ThemePicker = () => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  return (
    <select className="w-xs md:w-sm select-primary select select-xs bg-neutral capitalize md:select-sm" data-choose-theme>
      {AppConfig.themes.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  );
};

const LanguagePicker = () => {
  const { push, locale, locales, asPath } = useRouter();
  const localeMap: Map<string, string> = new Map([
    ['en', 'English'],
    ['zh-Hans', '简体中文'],
  ]);
  const handleLanguageChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    push(asPath, asPath, { locale: e.target.value });
  };
  return (
    <select className="w-xs md:w-sm select-primary select select-xs bg-neutral capitalize md:select-sm" onChange={handleLanguageChange} defaultValue={locale}>
      {locales?.map((l) => (
        <option key={l} value={l}>
          {localeMap.get(l)}
        </option>
      ))}
    </select>
  );
};

const RoutesList = ({ className }: { className: string }) => {
  const { t } = useTranslation('common');
  return (
    <ul tabIndex={0} className={className}>
      {AppConfig.routes.map((route) =>
        route.children ? (
          <li tabIndex={-1} key={route.id} className="dropdown-hover dropdown">
            <a className="hover:border-none">{t(route.id, { defaultValue: route.name })}</a>
            <ul tabIndex={-1} className="dropdown-content menu rounded-box bg-neutral p-2 shadow">
              {route.children.map((cr) => (
                <li key={cr.id}>
                  <Link href={cr.path} passHref>
                    <a target={cr.target} rel="noopener noreferrer" className="border-none">
                      {t(cr.id, { defaultValue: cr.name })}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={route.id}>
            <Link href={route.path} passHref>
              <a target={route.target} rel="noopener noreferrer" className="border-none">
                {t(route.id, { defaultValue: route.name })}
              </a>
            </Link>
          </li>
        )
      )}
    </ul>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar bg-neutral text-neutral-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <RoutesList className="dropdown-content menu rounded-box bg-neutral p-2 text-neutral-content shadow" />
        </div>
        <Link href="/">
          <a title={AppConfig.title} aria-label={AppConfig.title} className="btn-ghost btn text-xl normal-case">
            {AppConfig.title}
          </a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <RoutesList className="menu menu-horizontal" />
      </div>
      <div className="navbar-end gap-x-2">
        <LanguagePicker />
        <ThemePicker />
      </div>
    </nav>
  );
};

export { Navbar };
