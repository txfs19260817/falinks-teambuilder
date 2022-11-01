import type { TypeName } from '@pkmn/data';
import Image from 'next/image';
import { useRouter } from 'next/router';

export function RoundTypeIcon({ typeName }: { typeName: string | TypeName }) {
  const { basePath } = useRouter();
  return (
    <Image className="inline-block" width={24} height={24} alt={typeName} title={typeName} src={`${basePath}/assets/types/${typeName}.webp`} loading="lazy" />
  );
}
