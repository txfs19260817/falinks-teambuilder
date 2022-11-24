import type { Item, Move, Specie } from '@pkmn/data';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import PastesTable from '@/components/pastes/PastesTable';
import { FormatSelector } from '@/components/select/FormatSelector';
import { Select } from '@/components/select/Select';
import DexSingleton from '@/models/DexSingleton';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { defaultStats, getMovesBySpecie, maxEVStats, stats } from '@/utils/PokemonUtils';
import type { PastesList } from '@/utils/Prisma';
import type { SearchPasteForm, SearchPastePokemonCriteria } from '@/utils/Types';

const defaultPokemonCriteria: SearchPastePokemonCriteria = {
  species: 'Charizard',
  moves: ['', '', '', ''],
  minEVs: defaultStats,
  maxEVs: maxEVStats,
};

const Search = () => {
  const gen = DexSingleton.getGen();
  const { t } = useTranslation(['common', 'search']);
  const [searchResults, setSearchResults] = useState<PastesList | undefined>(undefined);
  const pokemonList = useMemo<Specie[]>(() => Array.from(gen.species), [gen]);
  const itemList = useMemo<Item[]>(() => Array.from(gen.items), [gen]);

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
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'speciesCriterion',
    rules: {
      validate: (v) => (v.length === 0 ? t('search:form.species.error') : true),
    },
  });
  // set learnset for the focused PokemonCriteria
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
        loading: t('search:form.submit.loading'),
        success: `${t('search:form.submit.success')} ↓`,
        error: (e) => `${t('search:form.submit.error')}: ${e}`,
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
    <Main title={t('search:title')}>
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
                <span className="label-text after:text-error after:content-['_*']">{t('search:form.species.label')}</span>
              </label>
              {/* Species Criterion */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    tabIndex={0}
                    className="collapse collapse-open border border-base-300 bg-base-200 rounded-box animate-fade-in-down"
                    onClick={() => setFocusSpIdx(index)}
                  >
                    {/* collapse title */}
                    <div className="collapse-title">
                      <div className="flex items-center justify-between">
                        <span className="ml-2">{index + 1}</span>
                        {/* Species */}
                        <div className="flex gap-x-1 items-center">
                          <PokemonIcon speciesId={field.species} />
                          <Select
                            itemClassName="w-5/6"
                            inputSize="sm"
                            options={pokemonList.map(({ name }) => ({
                              value: name,
                              label: name,
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
                              label: field.species,
                            }}
                            iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
                            ariaLabel={`Pokemon Select ${index}`}
                          />
                        </div>
                        <button className="btn btn-sm btn-error" type="button" onClick={() => remove(index)}>
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="collapse-content">
                      <div className="grid md:grid-rows-2 gap-1 grid-flow-col">
                        {/* Item */}
                        <label className="label">
                          <span className="label-text font-bold">Item</span>
                        </label>
                        <Select
                          itemClassName="w-5/6"
                          inputSize="sm"
                          options={[{ value: '', label: 'Any' }].concat(
                            itemList.map(({ name }) => ({
                              value: name,
                              label: name,
                            }))
                          )}
                          onChange={({ value }) => {
                            update(index, { ...field, item: value });
                          }}
                          value={{
                            value: field.item ?? '',
                            label: field.item ?? 'Any',
                          }}
                          defaultValue={{ value: '', label: 'Any' }}
                          iconGetter={(key: string) => <ItemIcon itemName={key} />}
                          ariaLabel={`Item Select ${index}`}
                        />
                        {/* Ability */}
                        <label className="label">
                          <span className="label-text font-bold">Ability</span>
                        </label>
                        <select
                          className="select select-bordered select-sm w-full"
                          value={field.ability}
                          onChange={(e) => update(index, { ...field, ability: e.target.value })}
                          role="listbox"
                          aria-label={`Ability Select ${index}`}
                        >
                          <option value="">Any</option>
                          {Object.values(gen.species.get(field.species)?.abilities ?? {}).map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Moves */}
                      <label className="label">
                        <span className="label-text font-bold">Moves</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        {field.moves.map((move, i) => (
                          <Select
                            key={i}
                            inputSize="sm"
                            itemClassName="w-1/2"
                            iconGetter={(k) => <RoundTypeIcon typeName={gen.moves.get(k)?.type ?? '???'} />}
                            options={learnset.map(({ name }) => ({
                              label: name,
                              value: name,
                            }))}
                            placeholder={`Move ${i + 1}`}
                            value={{
                              value: move,
                              label: move,
                            }}
                            defaultValue={{ value: '', label: '' }}
                            onChange={(e) => {
                              const newMoves = [...field.moves];
                              newMoves[i] = e.value;
                              update(index, { ...field, moves: newMoves });
                            }}
                            ariaLabel={`Move ${i + 1} Select ${index}`}
                          />
                        ))}
                      </div>
                      {/* EV ranges */}
                      <label className="label">
                        <span className="label-text font-bold">EVs (min to max)</span>
                      </label>
                      <div className="flex flex-wrap">
                        {stats.map((stat) => (
                          <div key={stat} className="grid-cols-6 grid gap-1 w-1/2 p-1">
                            <label className="uppercase">{stat}</label>
                            <input
                              type="number"
                              role="spinbutton"
                              aria-label={`${stat} min ${index}`}
                              step={4}
                              min={0}
                              max={252}
                              placeholder="0"
                              className="input input-bordered input-xs input-secondary col-span-2"
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
                              className="input input-bordered input-xs input-primary col-span-2"
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
                    className="btn btn-ghost text-2xl md:h-full border-dashed border-2 border-base-300"
                    onClick={() => append({ ...defaultPokemonCriteria })}
                  >
                    +
                  </button>
                )}
              </div>
              <p className="text-error text-sm">{errors.speciesCriterion?.root?.message}</p>
            </div>
            {/* Format */}
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">{t('search:form.format.label')}</span>
              </label>
              <FormatSelector
                inputGroup={false}
                formats={['', ...AppConfig.formats]}
                defaultFormat={AppConfig.defaultFormat}
                handleChange={(e) => setValue('format', e.target.value)}
              />
            </div>
            {/* Has Rental Code */}
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
      {searchResults && <PastesTable pastes={searchResults} />}
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
