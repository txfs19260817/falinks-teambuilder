import { MoveCategory } from '@pkmn/data';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

type CategoryIconProps = {
  category: string | MoveCategory;
  width?: number;
  height?: number;
};

export function CategoryIcon({ category, width = 32, height = 14 }: CategoryIconProps) {
  const { t } = useTranslation(['common', 'categories']);
  const { basePath } = useRouter();

  const translatedCategory = useMemo(() => t(`categories.${category.toLowerCase()}`, { defaultValue: category }), [t, category]);

  const imagePath = `${basePath}/assets/moves/categories/${category}.png`;

  return (
    <Image
      className="inline-block"
      width={width}
      height={height}
      alt={translatedCategory}
      title={translatedCategory}
      src={imagePath}
      objectFit="contain"
      loading="lazy"
    />
  );
}
