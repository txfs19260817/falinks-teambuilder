import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { PokePaste } from '@/models/PokePaste';
import { SupportedProtocolProvider, supportedProtocols } from '@/providers';
import { Main } from '@/templates/Main';

type RoomQueryParams = {
  // path params
  name: string;
  // query params
  protocol: SupportedProtocolProvider;
  pokepaste?: string;
  packed?: string;
};

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
});

// Known issue: if you access this page via go back, it might cause a series of warnings regarding update some unmounted components.
const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();

  // Get query params and rename them
  const { name: roomName, protocol, pokepaste: pokePasteUrl, packed } = query as RoomQueryParams;
  const protocolName = supportedProtocols.includes(protocol) ? protocol : 'WebSocket';

  // Set up the initial team if the pokepaste url is given and valid
  const [basePokePaste, setBasePokePaste] = useState<PokePaste | undefined>();

  useEffect(() => {
    if (packed) {
      setBasePokePaste(PokePaste.fromPackedTeam(packed));
    } else if (pokePasteUrl && PokePaste.isValidPokePasteURL(pokePasteUrl)) {
      PokePaste.pokePasteURLFetcher(pokePasteUrl).then((data) => {
        setBasePokePaste(data);
      });
    }

    // Remove PokePaste link from URL to allow for sharing
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete('pokepaste');
    params.delete('packed');
    url.search = params.toString();
    window.history.replaceState({}, document.title, url.toString());
  }, [packed, pokePasteUrl]);

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
