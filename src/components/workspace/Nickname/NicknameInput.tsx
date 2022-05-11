import { useSyncedStore } from '@syncedstore/react';
import { ChangeEvent, useEffect, useState } from 'react';

import { teamStore } from '@/store';

function NicknameInput({ tabIdx }: { tabIdx: number }) {
  const teamState = useSyncedStore(teamStore);
  const [nickname, setNickname] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setNickname(teamState.team[tabIdx]?.name || '');
  }, [teamState.team[tabIdx]?.name]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNick = e.target.value;
    setNickname(newNick);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].name = newNick;
  };

  return <input type="text" placeholder="Nickname" className="input-bordered input input-xs" value={nickname} onChange={handleChange} />;
}

export default NicknameInput;
