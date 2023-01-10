import { useTranslation } from 'next-i18next';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { MultiSelect } from '@/components/select/MultiSelect';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

const SpeciesMultiSelect = ({ species, onChange }: { species: string[]; onChange: (species: unknown[]) => void }) => {
  const { t } = useTranslation(['common', 'species']);
  const options = species
    .map((e) => ({
      value: e,
      label: t(getPokemonTranslationKey(e, 'species')),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <MultiSelect
      options={options}
      placeholder={`${t('common.pokemon')} ...`}
      onChange={onChange}
      iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
      ariaLabel="Species filter"
    />
  );
};

export default SpeciesMultiSelect;
