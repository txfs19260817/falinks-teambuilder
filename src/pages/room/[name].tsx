import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { SupportedProtocolProvider, supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

// Known issue: if you access this page via go back, it might cause a series of warnings regarding update some unmounted components.
const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();
  const { name: roomName, protocol } = query as {
    name: string;
    protocol: SupportedProtocolProvider;
  };
  const protocolName = supportedProtocols.includes(protocol) ? protocol : 'WebSocket';

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  return (
    <Main title={`Room - ${roomName}`}>
      <Toaster />
      {isReady && roomName ? <Workspace roomName={roomName} protocolName={protocolName} /> : <h1>Loading...</h1>}
    </Main>
  );
};

export default Room;
