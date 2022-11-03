import { MoveCategory } from '@pkmn/data';
import Image from 'next/image';
import { useRouter } from 'next/router';

export function CategoryIcon({ category }: { category: string | MoveCategory }) {
  const { basePath } = useRouter();
  return (
    <Image
      className="inline-block"
      width={32}
      height={14}
      key={category}
      alt={category}
      title={category}
      src={`${basePath}/assets/moves/categories/${category}.png`}
      loading="lazy"
    />
  );
}
