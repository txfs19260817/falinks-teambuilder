import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { PokePaste } from '@/models/PokePaste';
import { SupportedProtocolProvider, supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

// Known issue: if you access this page via go back, it might cause a series of warnings regarding update some unmounted components.
const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();
  const {
    name: roomName,
    protocol,
    pokepaste,
  } = query as {
    name: string;
    protocol: SupportedProtocolProvider;
    pokepaste: string;
  };
  const protocolName = supportedProtocols.includes(protocol) ? protocol : 'WebSocket';

  // Set up the initial team if the pokepaste url is given and valid
  const [basePokePaste, setBasePokePaste] = useState<PokePaste | undefined>();

  useEffect(() => {
    if (pokepaste && PokePaste.isValidPokePasteURL(pokepaste)) {
      PokePaste.pokePasteURLFetcher(pokepaste).then((data) => {
        setBasePokePaste(data);
      });
    }
  }, [pokepaste]);

  // Prompt the user if they try and leave with unsaved changes
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
      {isReady ? <Workspace roomName={roomName} protocolName={protocolName} basePokePaste={basePokePaste} /> : <h1>Loading...</h1>}
    </Main>
  );
};

export default Room;
