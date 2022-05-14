import { ReactNode } from 'react';

import { Meta } from '@/components/layout/Meta';
import { Navbar } from '@/components/layout/Navbar';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  title: string;
  description?: string;
  canonical?: string;
  disableNavbar?: boolean; // TODO: → override navbar
  children: ReactNode;
};

const Main = ({ title, description, children, canonical, disableNavbar }: IMainProps) => (
  <div className="w-full antialiased">
    <Meta title={`${AppConfig.title} - ${title}`} description={description || AppConfig.description} canonical={canonical} />
    {!disableNavbar && <Navbar />}
    <div className="mx-auto max-w-screen-xl">
      <div className="content py-5">{children}</div>
    </div>
  </div>
);

export { Main };
