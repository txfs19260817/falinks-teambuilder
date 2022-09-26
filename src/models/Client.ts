import { RelativePosition } from 'yjs';

import { BaseProvider } from '@/providers/baseProviders';
import { getRandomColor } from '@/utils/Helpers';
import { getRandomTrainerName } from '@/utils/PokemonUtils';

export type UserInfo = {
  color: string;
  name: string;
};

export type ClientInfo = {
  user: UserInfo;
  cursor: { anchor: RelativePosition; head: RelativePosition };
};

export class Client {
  provider: BaseProvider;

  constructor(provider: BaseProvider, username?: string) {
    this.provider = provider;
    this.username = username || getRandomTrainerName();
  }

  get clientInfo(): ClientInfo {
    return this.provider.awareness.getLocalState() as ClientInfo;
  }

  get allClientsInfo(): ClientInfo[] {
    return Array.from(this.provider.awareness.getStates().values() as Iterable<ClientInfo>);
  }

  get allAuthors(): string[] {
    return this.allClientsInfo.map((client) => client.user.name);
  }

  get username(): string {
    return this.clientInfo.user.name;
  }

  set username(username: string) {
    // You can think of your own awareness information as a key-value store.
    // We update our "user" field to propagate relevant user information.
    this.provider.awareness.setLocalStateField('user', {
      // Define a print name that should be displayed
      name: username,
      // Define a color (should be a hex string) that should be associated to the user:
      color: getRandomColor(),
    });
  }
}
