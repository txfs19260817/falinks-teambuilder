import { MappedTypeDescription } from '@syncedstore/core/types/doc';

export class TeamChangelog {
  user: string;

  tabIdx: number;

  category: string;

  oldValue: string;

  newValue: string;

  constructor(user: string, tabIdx: number, category: string, oldValue: string, newValue: string) {
    this.user = user;
    this.tabIdx = tabIdx;
    this.category = category;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }

  static PushChangelog(
    teamState: MappedTypeDescription<{
      history: TeamChangelog[];
    }>,
    user: string,
    tabIdx: number,
    category: string,
    oldValue: string,
    newValue: string
  ) {
    teamState.history.push(new TeamChangelog(user, tabIdx, category, oldValue, newValue));
  }
}
