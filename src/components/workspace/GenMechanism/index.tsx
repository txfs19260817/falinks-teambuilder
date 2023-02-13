import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import GMaxSwitch from '@/components/workspace/GMax/GMaxSwitch';
import TeraTypeSelect from '@/components/workspace/TeraTypeSelect';

function GenMechanism() {
  const { teamState } = useContext(StoreContext);
  if (teamState.format.includes('gen8')) return <GMaxSwitch />;
  if (teamState.format.includes('gen9')) return <TeraTypeSelect />;
  return null;
}

export default GenMechanism;
