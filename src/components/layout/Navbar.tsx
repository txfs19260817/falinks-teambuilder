import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { LanguagePicker } from '@/components/layout/LanguagePicker';
import { ThemePicker } from '@/components/layout/ThemePicker';
import { AppConfig } from '@/utils/AppConfig';
import { isRouteWithChildren, routes, RouteWithoutChildren } from '@/utils/Routes';

const RouteLinkButton = ({ route, className }: { route: RouteWithoutChildren; className: string }) => {
  const { t } = useTranslation('common');

  return (
    <li>
      <Link href={route.path} target={route.target} rel="noopener noreferrer" className={className} role="menuitem" aria-label={route.name}>
        {t(`routes.${route.id}.title`, {
          defaultValue: route.name,
          ns: 'common',
        })}
      </Link>
    </li>
  );
};

const RoutesList = ({ direction, className }: { direction: 'horizontal' | 'vertical'; className?: string }) => {
  const { t } = useTranslation('common');

  return (
    <ul tabIndex={0} className={`menu ${direction === 'vertical' ? 'menu-vertical' : 'menu-horizontal'} ${className}`}>
      {routes.map((route) =>
        isRouteWithChildren(route) ? (
          direction === 'vertical' ? (
            <li key={route.id}>
              <details className="min-w-40 font-bold">
                <summary>{t(`routes.${route.id}.title`, { defaultValue: route.name })}</summary>
                <ul>
                  {route.children.map((routeChild) => (
                    <RouteLinkButton key={routeChild.id} route={routeChild} className="text-neutral-content hover:bg-secondary" />
                  ))}
                </ul>
              </details>
            </li>
          ) : (
            <li tabIndex={-1} key={route.id} className="dropdown dropdown-hover" role="navigation" aria-label={route.id}>
              <summary role="button" className="btn btn-ghost btn-sm rounded-btn hover:bg-primary">
                {t(`routes.${route.id}.title`, { defaultValue: route.name })}
              </summary>
              <ul tabIndex={-1} className="menu dropdown-content rounded-box bg-neutral p-2 shadow">
                {route.children.map((routeChild) => (
                  <RouteLinkButton key={routeChild.id} route={routeChild} className="w-48 text-neutral-content hover:bg-secondary" />
                ))}
              </ul>
            </li>
          )
        ) : (
          <RouteLinkButton key={route.id} route={route} className="btn btn-ghost btn-sm rounded-btn hover:bg-secondary" />
        ),
      )}
    </ul>
  );
};

const HamburgerMenuIcon = () => (
  <button className="btn btn-circle btn-ghost lg:hidden" aria-label="Open Menu" role="button">
    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
      <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
    </svg>
  </button>
);

export const Navbar = ({ title = AppConfig.title }: { title?: string }) => {
  return (
    <nav className="navbar sticky top-0 z-50 bg-neutral text-neutral-content">
      <div className="navbar-start">
        <div className="dropdown" tabIndex={0}>
          <HamburgerMenuIcon />
          <RoutesList direction="vertical" className="dropdown-content rounded-box bg-neutral p-2 text-neutral-content shadow" />
        </div>
        <Link href="/" title={title} aria-label={title} className="btn btn-ghost text-lg normal-case md:text-xl">
          {title}
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <RoutesList direction="horizontal" />
      </div>
      <div className="navbar-end flex-col items-end sm:flex-row">
        <LanguagePicker />
        <ThemePicker />
      </div>
    </nav>
  );
};
