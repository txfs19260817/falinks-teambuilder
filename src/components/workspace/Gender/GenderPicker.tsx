import { useSyncedStore } from '@syncedstore/react';
import { ChangeEvent, Fragment, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { teamStore } from '@/store';

function GenderPicker({ tabIdx }: { tabIdx: number }) {
  const teamState = useSyncedStore(teamStore);
  // get dex
  const { gen } = useContext(DexContext);
  // read species
  const { species } = teamState.team[tabIdx]!;
  // if this is not undefined, it means this pokemon only has one gender
  const possibleGender = gen.species.get(species)?.gender;
  // otherwise, its gender could be either M or F
  const availableGenders: string[] = possibleGender ? [possibleGender as string] : ['M', 'F'];
  const [gender, setGender] = useState(availableGenders[0]);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setGender(teamState.team[tabIdx]?.gender || availableGenders[0]);
  }, [teamState.team[tabIdx]?.gender]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPicked = e.target.value;
    setGender(newPicked);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].gender = newPicked;
  };

  return (
    <div className="flex space-x-0.5 text-sm lg:text-lg">
      <label className="hidden md:block">Gender: </label>
      {availableGenders.map((g) => (
        <Fragment key={g}>
          <label>{g}</label>
          <input type="radio" value={g} checked={gender === g} className="radio radio-sm md:radio-md" onChange={handleChange} />
        </Fragment>
      ))}
    </div>
  );
}

export default GenderPicker;
