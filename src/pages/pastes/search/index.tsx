import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { FormatSelector } from '@/components/select/FormatSelector';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import type { SearchPasteForm } from '@/utils/Types';

const Search = () => {
  const { t } = useTranslation(['common', 'search']);
  const { register, handleSubmit, setValue } = useForm<SearchPasteForm>({
    defaultValues: {
      species: [],
      format: AppConfig.defaultFormat,
      hasRentalCode: false,
    },
  });

  const [species] = useState<Pokemon[]>([]);

  const onSubmit = (data: SearchPasteForm) => {
    const promise = fetch(`/api/pastes/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    toast
      .promise(promise, {
        loading: t('search:form.submit.loading'),
        success: t('search:form.submit.success'),
        error: (e) => `${t('search:form.submit.error')}: ${e}`,
      })
      .then((r) => r.json());
  };

  return (
    <Main title={t('search:title')}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="card my-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">Species</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {species.map((s) => (
                  <button key={s.id} type="button" className="btn btn-accent">
                    <PokemonIcon speciesId={s.id} />
                  </button>
                ))}
                {species.length < 6 && (
                  <button type="button" className="btn btn-ghost border-dashed border-2 border-base-300">
                    +
                  </button>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">{t('search:form.format.label')}</span>
              </label>
              <FormatSelector
                inputGroup={false}
                formats={AppConfig.formats.concat([`gen${AppConfig.defaultGen}`])}
                defaultFormat={AppConfig.defaultFormat}
                handleChange={(e) => setValue('format', e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text after:text-error after:content-['_*']">{t('search:form.rental.label')}</span>
                <input type="checkbox" className="checkbox" {...register('hasRentalCode')} />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">{t('search:form.submit.button')}</button>
            </div>
          </form>
        </div>
      </div>
    </Main>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'search'])),
    },
  };
}

export default Search;
