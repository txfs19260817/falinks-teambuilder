import Link from 'next/link';
import { useEffect } from 'react';
import { themeChange } from 'theme-change';

import { AppConfig } from '@/utils/AppConfig';

const ThemePicker = () => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  return (
    <select className="w-sm select-primary select select-sm bg-neutral capitalize" data-choose-theme>
      {AppConfig.themes.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  );
};

const Navbar = () => {
  return (
    <div className="navbar bg-neutral text-neutral-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box bg-neutral p-2 text-neutral-content shadow">
            {AppConfig.routes.map((route) => (
              <li key={route.path}>
                <Link href={route.path} passHref>
                  <a target={route.target} rel="noopener noreferrer" className="border-none">
                    {route.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/">
          <a className="btn btn-ghost text-xl normal-case">{AppConfig.title}</a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal">
          {AppConfig.routes.map((route) => (
            <li key={route.path}>
              <Link href={route.path} passHref>
                <a target={route.target} rel="noopener noreferrer" className="border-none">
                  {route.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <ThemePicker />
      </div>
    </div>
  );
};

export { Navbar };
