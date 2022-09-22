import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

function NicknameInput() {
  const { teamState, tabIdx } = useContext(StoreContext);

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
  };

  const handleBlur = () => {
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].name = nickname;
  };

  return <input type="text" placeholder="Nickname" className="input-bordered input input-xs" value={nickname} onChange={handleChange} onBlur={handleBlur} />;
}

export default NicknameInput;
