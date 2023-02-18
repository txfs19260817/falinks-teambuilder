import type { TypeName } from '@pkmn/data';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function RoundTypeIcon({ typeName, isTeraType = false }: { typeName: string | TypeName; isTeraType?: boolean }) {
  const { t } = useTranslation('types');
  const { basePath } = useRouter();
  const translatedTypeName = t(`types.${typeName.toLowerCase()}`, {
    defaultValue: typeName,
  });
  return (
    <Image
      className="inline-block"
      width={isTeraType ? 32 : 24}
      height={isTeraType ? 38 : 24}
      alt={translatedTypeName}
      title={translatedTypeName}
      src={`${basePath}/assets/${isTeraType ? `teratypes/${typeName}.png` : `types/${typeName}.webp`}`}
      loading="lazy"
    />
  );
}
