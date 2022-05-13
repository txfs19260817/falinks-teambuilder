import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

import { Main } from '@/templates/Main';

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

// Known issue: if you access this page via go back, it might cause a series of warnings regarding update some unmounted components.
const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();
  const roomName = (query.name as string) || 'Loading...';

  return (
    <Main title={`Room - ${roomName}`}>
      <Toaster />
      {isReady ? <Workspace roomName={roomName} /> : <h1>Loading...</h1>}
    </Main>
  );
};

export default Room;
