import type { TypeName } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import Image from 'next/image';

export function TypeIcon({ typeName }: { typeName: string | TypeName }) {
  return (
    <Image className="inline-block" width={32} height={14} key={typeName} alt={typeName} title={typeName} src={Icons.getType(typeName).url} loading="lazy" />
  );
}
