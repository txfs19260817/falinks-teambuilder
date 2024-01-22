type BaseRoute = {
  id: string;
  name: string;
};

export type RouteWithoutChildren = BaseRoute & {
  path: `/${string}` | `https://${string}`;
  target: '_self' | '_blank' | '_parent' | '_top';
};

type RouteWithChildren = BaseRoute & {
  children: RouteWithoutChildren[];
};

type Route = RouteWithChildren | RouteWithoutChildren;

export const isRouteWithChildren = (route: Route): route is RouteWithChildren => 'children' in route;

export const routes: Route[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    target: '_self',
  },
  {
    id: 'paste',
    name: 'Pastes',
    children: [
      {
        id: 'vgc_pastes',
        name: 'VGC Paste',
        path: '/pastes/vgc',
        target: '_self',
      },
      {
        id: 'public_pastes',
        name: 'User Shared',
        path: '/pastes/public',
        target: '_self',
      },
      {
        id: 'create_paste',
        name: 'Create',
        path: '/pastes/create',
        target: '_self',
      },
      {
        id: 'search_paste',
        name: 'Search',
        path: '/pastes/search',
        target: '_self',
      },
    ],
  },
  {
    id: 'usage',
    name: 'Usage',
    children: [
      {
        id: 'vgc_usage',
        name: 'VGCPastes Usage',
        path: '/usages/vgc',
        target: '_self',
      },
      {
        id: 'smogon_usage',
        name: 'Smogon Usage',
        path: '/usages/smogon',
        target: '_self',
      },
    ],
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    target: '_self',
  },
  {
    id: 'github',
    name: 'GitHub',
    path: 'https://github.com/txfs19260817/falinks-teambuilder',
    target: '_blank',
  },
];
