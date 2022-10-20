import { Icons, Sprites } from '@pkmn/img';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useId } from 'react';
import { toast } from 'react-hot-toast';
import useSWRImmutable from 'swr/immutable';

import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import Loading from '@/templates/Loading';
import { convertStylesStringToObject } from '@/utils/Helpers';
import { Paste } from '@/utils/Prisma';

const PasteLayout = ({ id }: { id: string }) => {
  const roomId = useId();
  const { locale } = useRouter();
  const { data: paste, error } = useSWRImmutable<Paste>(id, (i) => fetch(`/api/pastes/${i}`).then((res) => res.json()));

  if (error) {
    toast.error('An error occurred while fetching the paste.');
    return null;
  }
  if (!paste) return <Loading />;
  const team = Pokemon.convertPasteToTeam(paste.paste) || [];

  // handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(paste.paste).then(() => toast('📋 Copied!'));
  };

  const handleShare = () => {
    // try Web Share API first, fallback to copy link to clipboard
    try {
      navigator.share({
        text: paste.paste,
        url: window.location.href,
        title: paste.title,
      });
    } catch (e) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast('📋 The link has been copied to your clipboard as your browser does not support Web Share API.'));
    }
  };

  return (
    <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-3">
      {/* avatars */}
      <div className="hidden grid-rows-6 md:grid">
        {team.map((p) => (
          <PureSpriteAvatar key={p.species} url={Sprites.getPokemon(p.species).url} />
        ))}
      </div>
      <div className="grid grid-cols-3 grid-rows-2 justify-items-center align-middle md:hidden">
        {team.map((p) => (
          <span key={p.species} style={convertStylesStringToObject(Icons.getPokemon(p.species).style)}></span>
        ))}
      </div>
      {/* paste */}
      <pre className="ml-5 w-4/5 whitespace-pre-wrap">{paste.paste}</pre>
      {/* metadata */}
      <div className="prose ml-5 w-4/5 py-6">
        <h1>{paste.title}</h1>
        <h3>Author: {paste.author}</h3>
        <ul>
          <li>Format: {paste.format}</li>
          <li>
            Created at:{' '}
            {new Intl.DateTimeFormat(locale ?? 'en-US', {
              dateStyle: 'long',
            }).format(new Date(paste.createdAt))}
          </li>
          <li>Source: {paste.source || 'None'}</li>
          <li>Rental Code: {paste.rentalCode || 'None'}</li>
        </ul>
        <p className="break-all">Notes: {paste.notes}</p>
        <div className="flex justify-around">
          <button className="btn-primary btn-sm btn" type="button" onClick={handleCopy}>
            Copy PokePaste
          </button>
          <button className="btn-secondary btn-sm btn" type="button" onClick={handleShare}>
            Share
          </button>
          <Link href={`/room/room_${roomId}/?protocol=WebSocket&packed=${Pokemon.convertPasteToPackedTeam(paste.paste)}`}>
            <a className="btn-accent btn-sm btn">Open in Room</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasteLayout;
