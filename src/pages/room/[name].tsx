import { GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import { Pokemon } from '@/models/Pokemon';
import { SupportedProtocolProvider, supportedProtocols } from '@/providers';
import Loading from '@/templates/Loading';
import { Main } from '@/templates/Main';
import { isValidPokePasteURL } from '@/utils/PokemonUtils';
import type { BasePokePaste } from '@/utils/Types';

type RoomQueryParams = {
  // path params
  name: string;
  // query params
  protocol: SupportedProtocolProvider;
  pokepaste?: string; // url
  packed?: string; // packed team string
};

const Workspace = dynamic(() => import('@/components/workspace/index'), {
  ssr: false,
  loading: () => <Loading />,
});

// Known issue: if you access this page via go back, it might cause a series of warnings regarding update some unmounted components.
const Room = () => {
  // Get the room name from the params
  const { isReady, query } = useRouter();

  // Get query params and rename them
  const { name: roomName, protocol, pokepaste: pokePasteUrl, packed } = query as RoomQueryParams;
  const protocolName = supportedProtocols.includes(protocol) ? protocol : 'WebSocket';

  // Set up the initial team if the pokepaste url is given and valid
  const [basePokePaste, setBasePokePaste] = useState<BasePokePaste | undefined>();
  useEffect(() => {
    if (packed) {
      setBasePokePaste(Pokemon.convertPackedTeamToTeam(packed));
    } else if (isValidPokePasteURL(pokePasteUrl)) {
      Pokemon.pokePasteURLFetcher(pokePasteUrl!).then((data) => {
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
      {isReady ? <Workspace roomName={roomName} protocolName={protocolName} basePokePaste={basePokePaste} /> : <Loading />}
    </Main>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // no page needs be created at build time for dynamic pages
    fallback: 'blocking', // other routes should be resolved by the server
  };
};

export default Room;
