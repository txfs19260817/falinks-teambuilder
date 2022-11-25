import type { TypeName } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import Image from 'next/legacy/image';
import { useTranslation } from 'next-i18next';

export function TypeIcon({ typeName }: { typeName: string | TypeName }) {
  const { t } = useTranslation('common');
  const translatedTypeName = t(`common:types.${typeName.toLowerCase()}`, {
    defaultValue: typeName,
  });
  return (
    <Image
      className="inline-block"
      width={32}
      height={14}
      alt={translatedTypeName}
      title={translatedTypeName}
      src={Icons.getType(typeName).url}
      loading="lazy"
    />
  );
}
