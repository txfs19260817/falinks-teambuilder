import { GetStaticProps } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PokemonInfo } from '@/components/calc/PokemonInfo';
import { defaultDex, DexContextProvider } from '@/components/workspace/Contexts/DexContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const OutputAlert = () => {
  return (
    <div className="alert shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 stroke-info">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">New message!</h3>
          <div className="text-xs">You have 1 unread message</div>
        </div>
      </div>
      <div className="flex-none">
        <button className="btn-sm btn">See</button>
      </div>
    </div>
  );
};

const InputsPanel = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PokemonInfo index={1} />
      <div className="mockup-window border border-base-300">
        <div className="flex h-screen justify-center border-t border-base-300 px-4 py-16">2!</div>
      </div>
      <PokemonInfo index={2} />
    </div>
  );
};

const Page = () => {
  return (
    <DexContextProvider value={defaultDex}>
      <Main title="Damage Calculator">
        <OutputAlert />
        <InputsPanel />
      </Main>
    </DexContextProvider>
  );
};

export const getStaticProps: GetStaticProps<SSRConfig> = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};
export default Page;
