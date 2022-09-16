import { Icons, Sprites } from '@pkmn/img';
import { Filter, FindOptions, ObjectId } from 'mongodb';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { PureSpriteAvatar } from '@/components/workspace/SpriteAvatar/SpriteAvatar';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import Loading from '@/templates/Loading';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject, S4 } from '@/utils/Helpers';
import clientPromise from '@/utils/MongoDB';

export default function PasteId({ data, id }: { data: PokePaste | null; id: string }) {
  const [pasteInstance, setPasteInstance] = useState<PokePaste | undefined>(data ? new PokePaste(data) : undefined);
  const [team, setTeam] = useState<Pokemon[]>([]);

  useEffect(() => {
    if (data) {
      setPasteInstance(new PokePaste(data));
      setTeam(Pokemon.convertPasteToTeam(data.paste) || []);
    } else {
      fetch(`/api/pastes/${id}`)
        .then((r) => r.json())
        .then((d: PokePaste) => {
          setPasteInstance(new PokePaste(d));
          setTeam(Pokemon.convertPasteToTeam(d.paste) || []);
        });
    }
  }, [data]);

  return pasteInstance ? (
    <Main title={`Paste - ${pasteInstance.title}`}>
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
        <pre className="w-4/5 whitespace-pre-wrap">{pasteInstance.paste}</pre>
        {/* metadata */}
        <div className="prose w-4/5 py-6">
          <h1>{pasteInstance.title}</h1>
          <h3>Author: {pasteInstance.author}</h3>
          <p className="break-all">Notes: {pasteInstance.notes}</p>
          <div className="flex justify-around">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(pasteInstance.paste).then(() => toast('📋 Copied!'));
              }}
            >
              Copy PokePaste
            </button>
            {/* eslint-disable-next-line no-underscore-dangle */}
            <Link href={`/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${pasteInstance.toPackedTeam()}`}>
              <a className="btn btn-secondary btn-sm">Open in Room</a>
            </Link>
          </div>
        </div>
      </div>
    </Main>
  ) : (
    <Loading title="Paste" />
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);

  let data: PokePaste | null = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const collectionName of [AppConfig.collectionName.userPastes, AppConfig.collectionName.vgcPastes]) {
    // eslint-disable-next-line no-await-in-loop
    data = await db.collection<PokePaste>(collectionName).findOne({ _id: new ObjectId(params.id) } as Filter<PokePaste>, { _id: 0 } as FindOptions);
    if (data) break;
  }

  return {
    props: {
      paste: JSON.parse(JSON.stringify(data)) as PokePaste | null,
      id: params.id,
    },
  };
}

export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes); // only generate static pages for vgc pastes
  const cursor = collection.find({}, { projection: { _id: 1, title: 0, author: 0, paste: 0, notes: 0 } });

  const data = await collection.find().toArray();
  const paths = data.map(({ _id }: { _id: ObjectId }) => `/pastes/${_id.toString()}`);
  await cursor.close();

  return {
    paths: paths || [],
    fallback: false,
  };
}
