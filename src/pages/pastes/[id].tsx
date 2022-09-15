import { Sprites } from '@pkmn/img';
import { WithId } from 'mongodb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { S4 } from '@/utils/Helpers';

export default function PasteId() {
  const { isReady, query } = useRouter();
  const id = query.id as string;
  const { data, error } = useSWR<WithId<PokePaste>>(`/api/pastes/${id}`, (input) => fetch(input).then((res) => res.json()));
  if (!data || !isReady)
    return (
      <Main title={`Paste`}>
        <div>Loading...</div>
      </Main>
    );
  if (error)
    return (
      <Main title={`Paste`}>
        <div>Error: {error.message}</div>
      </Main>
    );

  const pasteInstance = new PokePaste(data);
  const team = Pokemon.convertPasteToTeam(data.paste) || [];
  return (
    <Main title={`Paste - ${data.title}`}>
      <div className="grid grid-cols-3">
        {/* avatars */}
        <div className="grid grid-rows-6">
          {team.map((p) => (
            <PureSpriteAvatar key={p.species} url={Sprites.getPokemon(p.species).url} />
          ))}
        </div>
        {/* paste */}
        <pre className="whitespace-pre-wrap">{data.paste}</pre>
        {/* metadata */}
        <div className="prose">
          <h1>{data.title}</h1>
          <h3>Author: {data.author}</h3>
          <p>Notes: {data.notes}</p>
          <div className="flex justify-around">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(data.paste).then(() => toast('📋 Copied!'));
              }}
            >
              Copy PokePaste
            </button>
            <Link href={`/room/room_${id}_${S4()}/?protocol=WebSocket&packed=${pasteInstance.toPackedTeam()}`}>
              <a className="btn btn-secondary btn-sm">Open in Room</a>
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}
