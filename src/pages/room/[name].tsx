import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Main } from '@/templates/Main';

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();
  if (!isReady)
    return (
      <Main title={`Room`}>
        <h1>Loading...</h1>
      </Main>
    );
  const roomName = query.name as string;

  return (
    <Main title={`Room - ${roomName}`}>
      <Workspace roomName={roomName} />
    </Main>
  );
};

export default Room;
