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

const GearIcon = () => (
  <button className={`btn btn-circle btn-ghost`} aria-label="Settings" role="button">
    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
    </svg>
  </button>
);

const SettingCard = () => (
  <div className="dropdown dropdown-end dropdown-bottom">
    <GearIcon />
    <div tabIndex={0} className="card dropdown-content card-compact z-[1] w-64 bg-primary p-2 text-primary-content shadow">
      <div className="card-body">
        <LanguagePicker />
        <ThemePicker />
      </div>
    </div>
  </div>
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
      <div className="navbar-end flex-col items-end">
        <SettingCard />
      </div>
    </nav>
  );
};
