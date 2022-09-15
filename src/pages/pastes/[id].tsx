import { Sprites } from '@pkmn/img';
import { ObjectId, WithId } from 'mongodb';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { S4 } from '@/utils/Helpers';
import clientPromise from '@/utils/MongoDB';

export default function PasteId({ paste, team }: { paste: WithId<PokePaste>; team: Pokemon[] }) {
  const pasteInstance = new PokePaste(paste);
  return (
    <Main title={`Paste - ${paste.title}`}>
      <div className="grid grid-cols-3">
        {/* avatars */}
        <div className="grid grid-rows-6">
          {team.map((p) => (
            <PureSpriteAvatar key={p.species} url={Sprites.getPokemon(p.species).url} />
          ))}
        </div>
        {/* paste */}
        <pre className="whitespace-pre-wrap">{paste.paste}</pre>
        {/* metadata */}
        <div className="prose">
          <h1>{paste.title}</h1>
          <h3>Author: {paste.author}</h3>
          <p>{paste.notes}</p>
          <div className="flex justify-around">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(paste.paste).then(() => toast('📋 Copied!'));
              }}
            >
              Copy
            </button>
            {/* eslint-disable-next-line no-underscore-dangle */}
            <Link href={`/room/room_${paste._id}_${S4()}/?protocol=WebSocket&packed=${pasteInstance.toPackedTeam()}`}>
              <a className="btn btn-secondary btn-sm">Open in Room</a>
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes);
  const data = await collection.findOne({ _id: new ObjectId(params.id) });
  const team = Pokemon.convertPasteToTeam(data?.paste ?? '');
  if (!(data && team)) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      paste: JSON.parse(JSON.stringify(data)),
      team: JSON.parse(JSON.stringify(team)),
    },
  };
}

export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes);
  const cursor = collection.find({}, { projection: { _id: 1, title: 0, author: 0, paste: 0, notes: 0 } });

  const data = await collection.find().toArray();
  const paths = data.map(({ _id }: { _id: ObjectId }) => `/pastes/${_id.toString()}`);
  await cursor.close();

  return {
    paths: paths || [],
    fallback: false,
  };
}
