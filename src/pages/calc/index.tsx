import { GetStaticProps } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { CalculationsContextProvider, defaultCalculations } from '@/components/calc/Context/CalculationsContext';
import { FieldSetter } from '@/components/calc/FieldSetters';
import { PokemonInfo } from '@/components/calc/PokemonInfo';
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

const Calculator = () => {
  return (
    <Main title="Damage Calculator">
      <OutputAlert />
      <div className="grid gap-4 md:grid-cols-3">
        <PokemonInfo index={1} />
        <FieldSetter />
        <PokemonInfo index={2} />
      </div>
    </Main>
  );
};

const Page = () => {
  return (
    <CalculationsContextProvider value={defaultCalculations}>
      <Calculator />
    </CalculationsContextProvider>
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
