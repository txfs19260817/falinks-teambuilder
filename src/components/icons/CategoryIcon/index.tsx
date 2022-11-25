import { MoveCategory } from '@pkmn/data';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function CategoryIcon({ category }: { category: string | MoveCategory }) {
  const { t } = useTranslation('common');
  const { basePath } = useRouter();

  const translatedCategory = t(`common:categories.${category.toLowerCase()}`, {
    defaultValue: category,
  });
  return (
    <Image
      className="inline-block"
      width={32}
      height={14}
      alt={translatedCategory}
      title={translatedCategory}
      src={`${basePath}/assets/moves/categories/${category}.png`}
      loading="lazy"
    />
  );
}
