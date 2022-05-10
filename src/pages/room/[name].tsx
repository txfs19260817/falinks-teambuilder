import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Main } from '@/templates/Main';

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();
  const roomName = (query.name as string) || 'Loading...';

  return <Main title={`Room - ${roomName}`}>{isReady ? <Workspace roomName={roomName} /> : <h1>Loading...</h1>}</Main>;
};

export default Room;
