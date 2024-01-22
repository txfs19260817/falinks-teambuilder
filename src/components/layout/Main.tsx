import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { Meta } from '@/components/layout/Meta';
import { Navbar } from '@/components/layout/Navbar';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const Main = ({ title, description, children }: IMainProps) => (
  <div className="w-full antialiased">
    <Toaster />
    <Meta title={title} description={description || AppConfig.description} />
    <Navbar />
    <div className="mx-auto min-h-main">{children}</div>
  </div>
);

export { Main };
