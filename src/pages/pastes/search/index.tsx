import type { Item, Move, Specie } from '@pkmn/data';
import type { StatsTable } from '@pkmn/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ItemIcon } from '@/components/icons/ItemIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { FormatSelector } from '@/components/select/FormatSelector';
import { Select } from '@/components/select/Select';
import DexSingleton from '@/models/DexSingleton';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { defaultStats, getMovesBySpecie, maxEVs } from '@/utils/PokemonUtils';
import type { SearchPasteForm, SearchPastePokemonCriteria } from '@/utils/Types';

const defaultPokemonCriteria: SearchPastePokemonCriteria = {
  species: 'Charizard',
  moves: ['', '', '', ''],
  minEVs: defaultStats,
  maxEVs,
};

const Search = () => {
  const gen = DexSingleton.getGen();
  const { t } = useTranslation(['common', 'search']);
  const pokemonList = useMemo<Specie[]>(() => Array.from(gen.species), [gen]);
  const itemList = useMemo<Item[]>(() => Array.from(gen.items), [gen]);
  const [learnset, setLearnset] = useState<Move[]>([]);
  const { register, handleSubmit, setValue, control } = useForm<SearchPasteForm>({
    defaultValues: {
      species: [],
      format: AppConfig.defaultFormat,
      hasRentalCode: false,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'species',
  });

  // load learnset
  useEffect(() => {
    getMovesBySpecie(defaultPokemonCriteria.species).then(setLearnset);
  }, []);

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
        <div className="card my-3 w-5/6 flex-shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            {/* Species */}
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">Species</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} tabIndex={0} className="collapse collapse-open border border-base-300 bg-base-100 rounded-box">
                    <div className="collapse-title">
                      <div className="flex flex-row items-center justify-between">
                        <PokemonIcon speciesId={field.species} />
                        <span className="ml-2">{field.species}</span>
                        <button className="btn btn-sm btn-error" type="button" onClick={() => remove(index)}>
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="collapse-content">
                      {/* Species */}
                      <label className="label">
                        <span className="label-text font-bold">Species</span>
                      </label>
                      <Select
                        itemClassName="w-5/6"
                        inputSize="sm"
                        options={pokemonList.map((p) => ({
                          value: p.name,
                          label: p.name,
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
                        value={{ value: field.species, label: field.species }}
                        iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
                      />
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
                        iconGetter={(key: string) => <ItemIcon itemName={key} />}
                      />
                      {/* Ability */}
                      <label className="label">
                        <span className="label-text font-bold">Ability</span>
                      </label>
                      <select
                        className="select select-bordered select-sm w-full"
                        value={field.ability}
                        onChange={(e) => update(index, { ...field, ability: e.target.value })}
                      >
                        <option value="">Any</option>
                        {Object.values(gen.species.get(field.species)?.abilities ?? {}).map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      {/* Moves */}
                      <label className="label">
                        <span className="label-text font-bold">Moves</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
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
                            onChange={(e) => {
                              const newMoves = [...field.moves];
                              newMoves[i] = e.value;
                              update(index, { ...field, moves: newMoves });
                            }}
                          />
                        ))}
                      </div>
                      {/* EV ranges */}
                      <label className="label">
                        <span className="label-text font-bold">EVs (min to max)</span>
                      </label>
                      <div className="flex flex-wrap">
                        {Object.keys(field.minEVs).map((stat) => (
                          <div key={stat} className="grid-cols-6 grid gap-1 w-1/2 p-1">
                            <label className="uppercase">{stat}</label>
                            <input
                              type="number"
                              step={4}
                              min={0}
                              max={252}
                              className="input input-bordered input-xs input-secondary col-span-2"
                              value={field.minEVs[stat as keyof StatsTable]}
                              onChange={(e) =>
                                update(index, {
                                  ...field,
                                  minEVs: {
                                    ...field.minEVs,
                                    [stat]: Math.min(252, Math.max(0, +e.target.value)),
                                  },
                                })
                              }
                            />
                            <span className="text-center">~</span>
                            <input
                              type="number"
                              step={4}
                              min={0}
                              max={252}
                              className="input input-bordered input-xs input-primary col-span-2"
                              value={field.maxEVs[stat as keyof StatsTable]}
                              onChange={(e) =>
                                update(index, {
                                  ...field,
                                  maxEVs: {
                                    ...field.maxEVs,
                                    [stat]: Math.min(252, Math.max(0, +e.target.value)),
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {fields.length < 6 && (
                  <button type="button" className="btn btn-ghost border-dashed border-2 border-base-300" onClick={() => append(defaultPokemonCriteria)}>
                    +
                  </button>
                )}
              </div>
            </div>
            {/* Format */}
            <div className="form-control">
              <label className="label">
                <span className="label-text after:text-error after:content-['_*']">{t('search:form.format.label')}</span>
              </label>
              <FormatSelector
                inputGroup={false}
                formats={['Any', ...AppConfig.formats]}
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
