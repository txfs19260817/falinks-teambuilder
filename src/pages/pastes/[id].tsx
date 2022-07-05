import { ObjectId } from 'mongodb';

import { Paste } from '@/components/workspace/types';
import { Main } from '@/templates/Main';
import clientPromise from '@/utils/MongoDB';

export default function PasteId({ paste }: { paste: Paste }) {
  if (!paste) {
    return <div>Loading...</div>;
  }

  return (
    <Main title={'Paste'}>
      <div className="alert alert-info shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>WIP</span>
        </div>
      </div>
      {JSON.stringify(paste, null, '\t')}
    </Main>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db('pastes');
  const collection = db.collection('teams');
  const data = await collection.findOne({ _id: new ObjectId(params.id) });

  return {
    props: {
      paste: JSON.parse(JSON.stringify(data)) || null,
    },
  };
}

export async function getStaticPaths() {
  const client = await clientPromise;
  const db = client.db('pastes');
  const collection = db.collection('teams');

  const data = await collection.find().toArray();
  const paths = data.map(({ _id }: { _id: ObjectId }) => `/pastes/${_id.toString()}`);
  return {
    paths: paths || [],
    fallback: false,
  };
}
