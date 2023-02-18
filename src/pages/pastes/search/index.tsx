import type { Item, Move, Specie, TypeName } from '@pkmn/data';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import PastesTable from '@/components/pastes/PastesTable';
import { formatOptionElementsGrouped, FormatSelector } from '@/components/select/FormatSelector';
import { Select } from '@/components/select/Select';
import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import DexSingleton from '@/models/DexSingleton';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { defaultStats, getMovesBySpecie, getPokemonTranslationKey, maxEVStats, stats, typesWithEmoji } from '@/utils/PokemonUtils';
import type { PastesList } from '@/utils/Prisma';
import type { SearchPasteForm, SearchPastePokemonCriteria } from '@/utils/Types';

const defaultPokemonCriteria: SearchPastePokemonCriteria = {
  species: 'Garchomp',
  moves: ['', '', '', ''],
  minEVs: defaultStats,
  maxEVs: maxEVStats,
};

const Search = () => {
  const gen = DexSingleton.getGen();
  const { t } = useTranslation(['common', 'search', 'species', 'moves', 'abilities', 'items']);
  const [searchResults, setSearchResults] = useState<PastesList>([]);
  const pokemonList = useMemo<Specie[]>(() => Array.from(gen.species), [gen]);
  const itemList = useMemo<Item[]>(() => Array.from(gen.items), [gen]);
  const formatManager = useMemo(() => new FormatManager(), []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SearchPasteForm>({
    defaultValues: {
      speciesCriterion: [],
      format: AppConfig.defaultFormat,
      hasRentalCode: false,
      officialOnly: true,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'speciesCriterion',
    rules: {
      validate: (v) => (v.length === 0 ? t('search.form.species.error') : true),
    },
  });
  // set learnset for the focused PokemonCriteria, e.g., when a move selector is focused, the learnset gets started to be loaded
  const [learnset, setLearnset] = useState<Move[]>([]);
  const [focusSpIdx, setFocusSpIdx] = useState<number | undefined>(undefined);
  useEffect(() => {
    getMovesBySpecie(focusSpIdx != null && focusSpIdx < fields.length ? fields[focusSpIdx]!.species : defaultPokemonCriteria.species).then(setLearnset);
  }, [focusSpIdx]);

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
        loading: t('search.form.submit.loading'),
        success: `${t('search.form.submit.success')} ↓`,
        error: (e) => `${t('search.form.submit.error')}: ${e}`,
      })
      .then((r) => r.json())
      .then((r) => {
        setSearchResults(r);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      });
  };

  return (
    <Main title={t('common.routes.search_paste.title')} description={t('common.routes.search_paste.description')}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="card my-2 w-full flex-shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            {/* Species */}
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">{t('common.pokemon')}</span>
              </label>
              {/* Species Criterion */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    tabIndex={0}
                    className="collapse-open rounded-box collapse animate-fade-in-down border border-base-300 bg-base-200"
                    onClick={() => setFocusSpIdx(index)}
                  >
                    {/* collapse title */}
                    <div className="collapse-title">
                      <div className="flex items-center justify-between">
                        <span className="ml-2">{index + 1}</span>
                        {/* Species */}
                        <div className="flex items-center gap-x-1">
                          <PokemonIcon speciesId={field.species} />
                          <Select
                            itemClassName="w-5/6"
                            inputSize="sm"
                            options={pokemonList.map(({ name }) => ({
                              value: name,
                              label: t(getPokemonTranslationKey(name, 'species')),
                            }))}
                            onChange={(e) => {
                              const newPokemon = gen.species.get(e.value);
                              if (newPokemon) {
                                getMovesBySpecie(newPokemon.name).then(setLearnset);
                                update(index, {
                                  ...defaultPokemonCriteria,
                                  species: newPokemon.name,
                                });
                              }
                            }}
                            value={{
                              value: field.species,
                              label: t(getPokemonTranslationKey(field.species, 'species')),
                            }}
                            iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
                            ariaLabel={`Pokemon Select ${index}`}
                          />
                        </div>
                        <button className="btn-error btn-sm btn" type="button" onClick={() => remove(index)}>
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="collapse-content">
                      <div className="grid grid-flow-row gap-1 sm:grid-flow-col">
                        {/* Item */}
                        <label className="label whitespace-nowrap">
                          <span className="label-text font-bold">{t('common.item')}</span>
                        </label>
                        <Select
                          itemClassName="w-5/6"
                          inputSize="sm"
                          options={[{ value: '', label: '' }].concat(
                            itemList.map(({ name }) => ({
                              value: name,
                              label: t(getPokemonTranslationKey(name, 'items')),
                            }))
                          )}
                          onChange={({ value }) => {
                            update(index, { ...field, item: value });
                          }}
                          value={{
                            value: field.item ?? '',
                            label: field.item ? t(getPokemonTranslationKey(field.item, 'items')) : '',
                          }}
                          defaultValue={{ value: '', label: '' }}
                          iconGetter={(key: string) => <ItemIcon itemName={key} />}
                          ariaLabel={`Item Select ${index}`}
                          placeholder={t('search.any')}
                        />
                        {/* Ability */}
                        <label className="label whitespace-nowrap">
                          <span className="label-text font-bold">{t('common.ability')}</span>
                        </label>
                        <select
                          className="select-bordered select select-sm w-full"
                          value={field.ability}
                          onChange={(e) => update(index, { ...field, ability: e.target.value })}
                          role="listbox"
                          aria-label={`Ability Select ${index}`}
                        >
                          <option value="">{t('search.any')}</option>
                          {Object.values(gen.species.get(field.species)?.abilities ?? {}).map((a) => (
                            <option key={a} value={a}>
                              {t(getPokemonTranslationKey(a, 'abilities'))}
                            </option>
                          ))}
                        </select>
                        {/* Tera Type */}
                        <label className="label whitespace-nowrap">
                          <span className="label-text font-bold">{t('common.teraType')}</span>
                        </label>
                        <ValueWithEmojiSelector
                          className="select-bordered select select-sm w-full"
                          options={typesWithEmoji}
                          emptyOption={t('search.any')}
                          enableEmojis={true}
                          bindValue={field.teraType}
                          onChange={(e) => {
                            update(index, {
                              ...field,
                              teraType: e.target.value as TypeName,
                            });
                          }}
                          ariaLabel={`Tera Type Select ${index}`}
                        />
                      </div>
                      {/* Moves */}
                      <label className="label">
                        <span className="label-text font-bold">{t('common.moves')}</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        {field.moves.map((move, i) => (
                          <Select
                            key={i}
                            inputSize="sm"
                            itemClassName="w-1/2"
                            iconGetter={(k) => <RoundTypeIcon typeName={gen.moves.get(k)?.type ?? '???'} />}
                            options={learnset.map(({ name }) => ({
                              value: name,
                              label: t(getPokemonTranslationKey(name, 'moves')),
                            }))}
                            value={{
                              value: move,
                              label: t(getPokemonTranslationKey(move, 'moves')),
                            }}
                            defaultValue={{ value: '', label: '' }}
                            onChange={(e) => {
                              const newMoves = [...field.moves];
                              newMoves[i] = e.value;
                              update(index, { ...field, moves: newMoves });
                            }}
                            ariaLabel={`Move ${i + 1} Select ${index}`}
                            placeholder={`${t('common.move')} ${i + 1}`}
                          />
                        ))}
                      </div>
                      {/* EV ranges */}
                      <label className="label">
                        <span className="label-text font-bold">{t('search.form.species.evRanges')}</span>
                      </label>
                      <div className="flex flex-wrap">
                        {stats.map((stat) => (
                          <div key={stat} className="grid w-1/2 grid-cols-12 gap-1 p-1">
                            <label className="col-span-3 text-sm">{t(`common.stats.${stat}`)}</label>
                            <input
                              type="number"
                              role="spinbutton"
                              aria-label={`${stat} min ${index}`}
                              step={4}
                              min={0}
                              max={252}
                              placeholder="0"
                              className="input-bordered input-secondary input input-xs col-span-4"
                              {...register(`speciesCriterion.${index}.minEVs.${stat}` as `speciesCriterion.${number}.minEVs.hp`)}
                            />
                            <span className="text-center">~</span>
                            <input
                              type="number"
                              role="spinbutton"
                              aria-label={`${stat} max ${index}`}
                              step={4}
                              min={0}
                              max={252}
                              placeholder="252"
                              className="input-bordered input-primary input input-xs col-span-4"
                              {...register(`speciesCriterion.${index}.maxEVs.${stat}` as `speciesCriterion.${number}.maxEVs.hp`)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {fields.length < 6 && (
                  <button
                    type="button"
                    className="btn-ghost btn border-2 border-dashed border-base-300 text-2xl"
                    onClick={() => append({ ...defaultPokemonCriteria })}
                  >
                    +
                  </button>
                )}
              </div>
              <p className="text-sm text-error">{errors.speciesCriterion?.root?.message}</p>
            </div>
            {/* Format */}
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">{t('common.format')}</span>
              </label>
              <FormatSelector
                defaultFormat={formatManager.defaultFormat.id}
                onChange={(e) => setValue('format', e.target.value)}
                options={formatOptionElementsGrouped(formatManager.groupFormatsByGen())}
              />
            </div>
            {/* Has Rental Code */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text after:text-error after:content-['_*']">{t('search.form.rental')}</span>
                <input type="checkbox" className="checkbox" {...register('hasRentalCode')} />
              </label>
            </div>
            {/* Official pastes only */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text after:text-error after:content-['_*']">{t('search.form.official')}</span>
                <input type="checkbox" className="checkbox" {...register('officialOnly')} />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">{t('search.form.submit.button')}</button>
            </div>
          </form>
        </div>
      </div>
      <PastesTable pastes={searchResults} />
    </Main>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'search', 'species', 'moves', 'abilities', 'items', 'types'])),
    },
  };
}

export default Search;
