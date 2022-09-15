import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { Footer } from '@/components/layout/Footer';
import { Meta } from '@/components/layout/Meta';
import { Navbar } from '@/components/layout/Navbar';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  title: string;
  description?: string;
  canonical?: string;
  children: ReactNode;
};

const Main = ({ title, description, children, canonical }: IMainProps) => (
  <div className="w-full antialiased">
    <Toaster />
    <Meta title={`${AppConfig.title} - ${title}`} description={description || AppConfig.description} canonical={canonical} />
    <Navbar />
    <div className="mx-auto">{children}</div>
    <Footer />
  </div>
);

export { Main };
