import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';

interface CreatePasteForm extends PokePaste {
  public: boolean;
}

const Create = () => {
  const { t } = useTranslation(['common', 'create']);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasteForm>({
    defaultValues: {
      notes: '',
      public: false,
    },
  });

  const onSubmit = (data: CreatePasteForm) => {
    const { public: isPublic, ...pasteBody } = data;
    const promise = fetch(`/api/pastes/create?public=${isPublic}`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pasteBody),
    });
    toast
      .promise(promise, {
        loading: t('create:form.submit.loading'),
        success: t('create:form.submit.success'),
        error: (e) => `${t('create:form.submit.error')}: ${e}`,
      })
      .then((r) => {
        if (r.url) {
          window.location.href = r.url;
        }
      });
  };

  return (
    <Main title={t('create:title')}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="card my-3 w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text after:text-error after:content-['_*']">{t('create:form.title.label')}</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder={t('create:form.title.placeholder')}
                required={true}
                maxLength={50}
                className="input-bordered input text-base-content"
                {...register('title', {
                  required: true,
                })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="author">
                <span className="label-text after:text-error after:content-['_*']">{t('create:form.author.label')}</span>
              </label>
              <input
                id="author"
                type="text"
                placeholder={t('create:form.author.placeholder')}
                required={true}
                maxLength={36}
                className="input-bordered input text-base-content"
                {...register('author', { required: true })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="paste">
                <span className="label-text after:text-error after:content-['_*']">{t('create:form.paste.label')}</span>
              </label>
              <textarea
                id="paste"
                className={`textarea-bordered textarea text-base-content ${errors.paste ? 'textarea-error' : ''}`}
                placeholder={t('create:form.paste.placeholder')}
                rows={9}
                {...register('paste', {
                  required: true,
                  validate: (value) => Pokemon.convertPasteToTeam(value) != null || t('create:form.paste.error'),
                })}
              />
              {errors.paste && <p className="text-xs text-error-content">{errors.paste.message}</p>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="notes">
                <span className="label-text">{t('create:form.notes.label')}</span>
              </label>
              <textarea id="notes" className="textarea-bordered textarea" placeholder={t('create:form.notes.placeholder')} rows={3} {...register('notes')} />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">🔐{t('create:form.public.private')}</span>
                <input type="checkbox" className="toggle-secondary toggle" {...register('public')} />
                <span className="label-text">🌐{t('create:form.public.public')}</span>
              </label>
              <p className="text-xs text-warning-content">{t('create:form.public.warning')}</p>
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">{t('create:form.submit.button')}</button>
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
      ...(await serverSideTranslations(locale, ['common', 'create'])),
    },
  };
}

export default Create;
