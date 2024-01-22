import type { TypeName } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

type RoundTypeIconProps = {
  typeName: string | TypeName;
  isTeraType?: boolean;
  isRound?: boolean;
  width?: number;
  height?: number;
};

export function RoundTypeIcon({ typeName, isRound = false, isTeraType = false, width = 32, height = 38 }: RoundTypeIconProps) {
  const { t } = useTranslation('types');
  const { basePath } = useRouter();
  const translatedTypeName = t(`types.${typeName.toLowerCase()}`, {
    defaultValue: typeName,
  });

  const imageSize = width && height ? { width, height } : isTeraType ? { width: 32, height: 38 } : { width: 24, height: 24 };
  const imageSrc = isRound ? `${basePath}/assets/${isTeraType ? `teratypes/${typeName}.png` : `types/${typeName}.webp`}` : Icons.getType(typeName).url;

  return (
    <Image
      className="inline-block"
      width={imageSize.width}
      height={imageSize.height}
      alt={translatedTypeName}
      title={translatedTypeName}
      src={imageSrc}
      loading="lazy"
    />
  );
}
