import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { formatOptionElementsGrouped, FormatSelector } from '@/components/select/FormatSelector';
import FormatManager from '@/models/FormatManager';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { isValidPokePasteURL } from '@/utils/PokemonUtils';

type CreatePasteForm = {
  author: string;
  title: string;
  paste: string;
  notes: string;
  source: string;
  rentalCode: string;
  format: string;
  isPublic: boolean;
  isOfficial: boolean;
};

const Create = () => {
  const { t } = useTranslation(['common', 'create']);
  const formatManager = new FormatManager();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreatePasteForm>({
    defaultValues: {
      format: formatManager.defaultFormat.id,
      notes: '',
      source: '',
      rentalCode: '',
      isPublic: false,
      isOfficial: false,
    },
  });

  const postData = async (data: CreatePasteForm) => {
    const promise = fetch(`/api/pastes/create`, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await toast
      .promise(promise, {
        loading: t('create.form.submit.loading'),
        success: t('create.form.submit.success'),
        error: (e) => `${t('create.form.submit.error')}: ${e}`,
      })
      .then((r) => {
        if (r.url) {
          window.location.href = r.url;
        }
      });
  };

  const onSubmit = (data: CreatePasteForm) => {
    // check if the paste field is a PokePaste link
    if (isValidPokePasteURL(data.paste)) {
      Pokemon.pokePasteURLFetcher(data.paste)
        .then(({ paste }) => {
          data.paste = paste;
        })
        .then(() => postData(data))
        .catch((err) => {
          setError('paste', {
            type: 'custom',
            message: `${t('create.invalidPokePaste')}: ${err}`,
          });
        });
    } else {
      postData(data);
    }
  };

  return (
    <Main title={t('common.routes.create_paste.title')} description={t('common.routes.create_paste.description')}>
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
                <span className="label-text after:text-error after:content-['_*']">{t('create.form.title.label')}</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder={t('create.form.title.placeholder')}
                required={true}
                maxLength={50}
                className="input-bordered input input-sm text-base-content"
                {...register('title', {
                  required: true,
                })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="author">
                <span className="label-text after:text-error after:content-['_*']">{t('create.form.author.label')}</span>
              </label>
              <input
                id="author"
                type="text"
                placeholder={t('create.form.author.placeholder')}
                required={true}
                maxLength={36}
                className="input-bordered input input-sm text-base-content"
                {...register('author', { required: true })}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="source">
                <span className="label-text">{t('create.form.source.label')}</span>
              </label>
              <input
                id="source"
                type="url"
                placeholder="https://twitter.com/..."
                maxLength={300}
                className="input-bordered input input-sm text-base-content"
                {...register('source', { required: false })}
              />
              <p className="text-xs text-base-content">{t('create.form.source.description')}</p>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="rentalCode">
                <span className="label-text">{t('create.form.rental.label')}</span>
              </label>
              <input
                id="rentalCode"
                type="text"
                placeholder="ABCDEF"
                maxLength={18}
                className="input-bordered input input-sm text-base-content"
                {...register('rentalCode', { required: false })}
              />
              <p className="text-xs text-base-content">{t('create.form.rental.description')}</p>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="format">
                <span className="label-text after:text-error after:content-['_*']">{t('create.form.format.label')}</span>
              </label>
              <FormatSelector
                defaultFormat={formatManager.defaultFormat.id}
                onChange={(e) => setValue('format', e.target.value)}
                options={formatOptionElementsGrouped(formatManager.groupFormatsByGen())}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="paste">
                <span className="label-text after:text-error after:content-['_*']">{t('create.form.paste.label')}</span>
              </label>
              <textarea
                id="paste"
                className={`textarea-bordered textarea text-base-content ${errors.paste ? 'textarea-error' : ''}`}
                placeholder={t('create.form.paste.placeholder')}
                rows={6}
                {...register('paste', {
                  required: true,
                  validate: (v) => isValidPokePasteURL(v) || Pokemon.convertPasteToTeam(v) != null || t('create.form.paste.error'),
                })}
              />
              {errors.paste && <p className="text-xs text-error-content">{errors.paste.message}</p>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="notes">
                <span className="label-text">{t('create.form.notes.label')}</span>
              </label>
              <textarea id="notes" className="textarea-bordered textarea" placeholder={t('create.form.notes.placeholder')} rows={3} {...register('notes')} />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">🔐{t('create.form.public.private')}</span>
                <input type="checkbox" className="toggle-secondary toggle" {...register('isPublic')} />
                <span className="label-text">🌐{t('create.form.public.public')}</span>
              </label>
              <p className="text-xs text-warning-content">{t('create.form.public.warning')}</p>
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">{t('create.form.submit.button')}</button>
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
