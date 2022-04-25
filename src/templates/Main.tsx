import { ReactNode } from 'react';

import { Meta } from '@/layout/Meta';
import { Navbar } from '@/layout/Navbar';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  title: string;
  description?: string;
  canonical?: string;
  children: ReactNode;
};

const Main = ({ title, description, children, canonical }: IMainProps) => (
  <div className="w-full antialiased">
    <Meta title={`${AppConfig.title} - ${title}`} description={description || AppConfig.description} canonical={canonical} />
    <Navbar />
    <div className="mx-auto max-w-screen-lg">
      <div className="content py-5">{children}</div>
    </div>
  </div>
);

export { Main };
