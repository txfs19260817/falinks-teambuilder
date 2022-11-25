import type { TypeName } from '@pkmn/data';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function RoundTypeIcon({ typeName }: { typeName: string | TypeName }) {
  const { t } = useTranslation('common');
  const { basePath } = useRouter();
  const translatedTypeName = t(`common:types.${typeName.toLowerCase()}`, {
    defaultValue: typeName,
  });
  return (
    <Image
      className="inline-block"
      width={24}
      height={24}
      alt={translatedTypeName}
      title={translatedTypeName}
      src={`${basePath}/assets/types/${typeName}.webp`}
      loading="lazy"
    />
  );
}
