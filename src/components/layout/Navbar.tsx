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

const RoutesList = ({ className }: { className: string }) => {
  return (
    <ul className={className}>
      {AppConfig.routes.map((route) =>
        route.children ? (
          <li key={route.name} className="dropdown-hover dropdown">
            <a className="hover:border-none">{route.name}</a>
            <ul className="dropdown-content menu rounded-box bg-neutral p-2 shadow">
              {route.children.map((cr) => (
                <li key={cr.name}>
                  <Link href={cr.path} passHref>
                    <a target={cr.target} rel="noopener noreferrer" className="border-none">
                      {cr.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={route.name}>
            <Link href={route.path} passHref>
              <a target={route.target} rel="noopener noreferrer" className="border-none">
                {route.name}
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
    <div className="navbar bg-neutral text-neutral-content">
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
          <a className="btn-ghost btn text-xl normal-case">{AppConfig.title}</a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <RoutesList className="menu menu-horizontal" />
      </div>
      <div className="navbar-end">
        <ThemePicker />
      </div>
    </div>
  );
};

export { Navbar };
