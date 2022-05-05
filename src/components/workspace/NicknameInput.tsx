import { ChangeEvent, useEffect, useState } from 'react';

import { PanelProps } from '@/components/workspace/types';

export function NicknameInput({ tabIdx, teamState }: PanelProps) {
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

  return <input type="text" placeholder="Nickname" className="input-accent input input-xs" value={nickname} onChange={handleChange} />;
}
